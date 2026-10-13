const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, isDbAvailable } = require('../db');

// In-memory fallback users for development without MySQL
const MOCK_USERS = [
  {
    id: 1,
    name: 'مدير متجر كنوز',
    email: 'admin@kounoz.sa',
    password_hash: bcrypt.hashSync('admin123', 10),
    phone: '01022822123',
    is_admin: true,
  },
  {
    id: 2,
    name: 'عمر جميل',
    email: 'omargamil37@gmail.com',
    password_hash: bcrypt.hashSync('admin123', 10),
    phone: '01022822123',
    is_admin: true,
  },
  {
    id: 3,
    name: 'محسن جميل',
    email: 'mohsengamil00@gmail.com',
    password_hash: bcrypt.hashSync('admin123', 10),
    phone: '01066583964',
    is_admin: true,
  },
  {
    id: 4,
    name: 'كنوز للثوب العربي',
    email: 'kounozthobe@gmail.com',
    password_hash: bcrypt.hashSync('admin123', 10),
    phone: '01022822123',
    is_admin: true,
  },
  {
    id: 5,
    name: 'عميل كنوز المميز',
    email: 'customer@kounoz.sa',
    password_hash: bcrypt.hashSync('user123', 10),
    phone: '01012345678',
    is_admin: false,
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'kounoz_super_jwt_secret_key_2026';

// Standard universal email format validation
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email.trim().toLowerCase());
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'صيغة البريد الإلكتروني غير صالحة (مثال: name@gmail.com)',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    }

    if (!isDbAvailable()) {
      const existing = MOCK_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return res.status(409).json({ success: false, error: 'هذا البريد الإلكتروني مسجل مسبقاً' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: cleanEmail,
        password_hash: passwordHash,
        phone: phone || '',
        is_admin: cleanEmail.includes('admin') || cleanEmail.includes('kounozthobe'),
      };
      MOCK_USERS.push(newUser);

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        data: { token, user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, is_admin: newUser.is_admin } },
      });
    }

    // Database mode
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'هذا البريد الإلكتروني مسجل مسبقاً' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name.trim(), cleanEmail, passwordHash]
    );

    const token = jwt.sign(
      { id: result.insertId, email: cleanEmail, name: name.trim() },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: { token, user: { id: result.insertId, name: name.trim(), email: cleanEmail, phone } },
    });
  } catch (err) {
    console.error('❌ /api/auth/register error:', err.message);
    res.status(500).json({ success: false, error: 'تعذر إنشاء الحساب' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!isDbAvailable()) {
      const user = MOCK_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return res.status(401).json({ success: false, error: 'هذا البريد الإلكتروني غير مسجل لدينا، يرجى إنشاء حساب جديد' });
      }

      // Strictly verify password hash
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        data: { token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, is_admin: user.is_admin } },
      });
    }

    // Database mode
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'هذا البريد الإلكتروني غير مسجل لدينا، يرجى إنشاء حساب جديد' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: { token, user: { id: user.id, name: user.name, email: user.email } },
    });
  } catch (err) {
    console.error('❌ /api/auth/login error:', err.message);
    res.status(500).json({ success: false, error: 'تعذر تسجيل الدخول' });
  }
});

module.exports = router;
