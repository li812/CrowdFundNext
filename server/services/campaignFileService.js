const multer = require('multer');
const path = require('path');
const fs = require('fs');

const photoDir = path.join(__dirname, '../uploads/campaign_photos');
const docDir = path.join(__dirname, '../uploads/campaign_docs');
if (!fs.existsSync(photoDir)) fs.mkdirSync(photoDir, { recursive: true });
if (!fs.existsSync(docDir)) fs.mkdirSync(docDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, docDir);
    else cb(null, photoDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.uid}_${Date.now()}_${file.fieldname}${ext}`);
  }
});

const uploadCampaign = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB per file
  fileFilter: (req, file, cb) => {
    if (
      file.fieldname === 'supportDoc' && file.mimetype === 'application/pdf'
      || file.fieldname === 'photos' && file.mimetype.startsWith('image/')
    ) cb(null, true);
    else cb(new Error('Invalid file type'));
  }
});

module.exports = { uploadCampaign };