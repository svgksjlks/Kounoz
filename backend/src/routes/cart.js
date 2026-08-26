const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

// All cart routes require authentication
router.use(authMiddleware);

// GET /api/cart — get user's cart
router.get('/', async (req, res) => {
  try {
    const [items] = await pool.query(
      `SELECT
        ci.id,
        ci.product_id,
        ci.quantity,
        ci.color,
        p.name,
        p.price,
        p.image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({ success: true, data: { items, total: parseFloat(total.toFixed(2)) } });
  } catch (err) {
    console.error('❌ GET /api/cart error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch cart' });
  }
});

// POST /api/cart/add — add item to cart
router.post('/add', async (req, res) => {
  try {
    const { product_id, quantity = 1, color } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, error: 'product_id is required' });
    }

    // Check if item already exists in cart
    const [existing] = await pool.query(
      `SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? AND color = ?`,
      [req.user.id, product_id, color || null]
    );

    if (existing.length > 0) {
      // Update quantity
      await pool.query(
        `UPDATE cart_items SET quantity = quantity + ? WHERE id = ?`,
        [quantity, existing[0].id]
      );
    } else {
      // Insert new item
      await pool.query(
        `INSERT INTO cart_items (user_id, product_id, quantity, color) VALUES (?, ?, ?, ?)`,
        [req.user.id, product_id, quantity, color || null]
      );
    }

    res.json({ success: true, message: 'Item added to cart' });
  } catch (err) {
    console.error('❌ POST /api/cart/add error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to add item to cart' });
  }
});

// DELETE /api/cart/:itemId — remove item from cart
router.delete('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;

    const [result] = await pool.query(
      `DELETE FROM cart_items WHERE id = ? AND user_id = ?`,
      [itemId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Item not found in cart' });
    }

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    console.error('❌ DELETE /api/cart/:itemId error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to remove item' });
  }
});

// DELETE /api/cart — clear entire cart
router.delete('/', async (req, res) => {
  try {
    await pool.query(`DELETE FROM cart_items WHERE user_id = ?`, [req.user.id]);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    console.error('❌ DELETE /api/cart error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to clear cart' });
  }
});

module.exports = router;
