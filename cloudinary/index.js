const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Connect to Cloudinary account
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Create new instance of CloudinaryStorage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Benchmate",
    allowed_formats: ["jpeg", "jpg", "png"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
