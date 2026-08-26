const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'product-' + uniqueSuffix + ext);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/avif',
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('يسمح فقط برفع ملفات الصور (JPG, PNG, WEBP, GIF, SVG)'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max per image
  },
});

// Single image upload: POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'لم يتم اختيار أي ملف للرفع' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      url: fileUrl,
      relativePath: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      message: 'تم رفع الصورة بنجاح من الجهاز',
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء رفع الصورة' });
  }
});

// Multiple images upload: POST /api/upload/multiple
router.post('/multiple', upload.array('images', 8), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'لم يتم اختيار أي ملفات للرفع' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const urls = req.files.map((file) => `${protocol}://${host}/uploads/${file.filename}`);

    res.json({
      success: true,
      urls: urls,
      files: req.files.map((f) => ({
        filename: f.filename,
        url: `${protocol}://${host}/uploads/${f.filename}`,
      })),
      message: `تم رفع ${req.files.length} صور بنجاح من الجهاز`,
    });
  } catch (err) {
    console.error('Multiple upload error:', err);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء رفع الصور' });
  }
});

module.exports = router;
