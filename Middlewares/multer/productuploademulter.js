const multer = require("multer");
const path = require("path");
const fs = require("fs");
 
const productAttachmentDir = "./uploads/products";
 
if (!fs.existsSync(productAttachmentDir)) {
  fs.mkdirSync(productAttachmentDir, { recursive: true });
}
 
const uploads = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (req.body.type === 'BuyerImage') {
        cb(null, productAttachmentDir);
      } else {
        cb(null, productAttachmentDir);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const mimeType = allowedFileTypes.test(file.mimetype);
    const extName = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
 
    if (mimeType && extName) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, or PNG files are allowed"));
    }
  },
});
 
module.exports = uploads;