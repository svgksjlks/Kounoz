const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check if Cloudinary is configured
const hasCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

let storage;
let cloudinary = null;

if (hasCloudinary) {
  const { v2 } = require('cloudinary');
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  cloudinary = v2;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'kounoz-products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'],
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1400, height: 1400, crop: 'limit' },
      ],
    },
  });
} else {
  // Local fallback storage
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, 'kounoz-' + uniqueSuffix + ext);
    },
  });
}

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('يسمح فقط برفع ملفات الصور'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
});

// ── POST /api/upload — Single image ────────────────────────────────────────
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'لم يتم اختيار أي ملف للرفع' });
    }

    let url;
    if (hasCloudinary) {
      url = req.file.path || req.file.secure_url;
    } else {
      const host = req.get('host');
      const protocol = req.protocol;
      url = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    res.json({
      success: true,
      url,
      provider: hasCloudinary ? 'cloudinary' : 'local',
      public_id: req.file.filename,
      message: hasCloudinary
        ? 'تم رفع الصورة على Cloudinary بنجاح ☁️'
        : 'تم رفع الصورة محلياً بنجاح (أضف بيانات Cloudinary للرفع السحابي)',
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء رفع الصورة' });
  }
});

// ── POST /api/upload/multiple — Multiple images ────────────────────────────
router.post('/multiple', upload.array('images', 8), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'لم يتم اختيار أي ملفات للرفع' });
    }

    let urls;
    if (hasCloudinary) {
      urls = req.files.map((f) => f.path || f.secure_url);
    } else {
      const host = req.get('host');
      const protocol = req.protocol;
      urls = req.files.map((f) => `${protocol}://${host}/uploads/${f.filename}`);
    }

    res.json({
      success: true,
      urls,
      provider: hasCloudinary ? 'cloudinary' : 'local',
      files: req.files.map((f) => ({
        url: hasCloudinary ? (f.path || f.secure_url) : `${req.protocol}://${req.get('host')}/uploads/${f.filename}`,
        public_id: f.filename,
      })),
      message: `تم رفع ${req.files.length} صور بنجاح ${hasCloudinary ? 'على Cloudinary ☁️' : 'محلياً'}`,
    });
  } catch (err) {
    console.error('Multiple upload error:', err);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء رفع الصور' });
  }
});

module.exports = router;
