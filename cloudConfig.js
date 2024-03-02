const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});

// here we created a storage space in cloudinary.
// where we've defined folder name and its allowed format.
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust',
      allowedFormats : ["png", "jpg", "jpeg"]
    },
  });

  module.exports = {
    cloudinary,
    storage
  };
