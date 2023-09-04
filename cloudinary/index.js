const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, //this is the cloud name from cloudinary
    api_key: process.env.CLOUDINARY_KEY, //this is the api key from cloudinary
    api_secret: process.env.CLOUDINARY_SECRET //this is the api secret from cloudinary
})


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp', //this is the folder in cloudinary where we want to store the images
        allowedFormats: ['jpeg', 'png', 'jpg'],
    }
});

module.exports = {
    cloudinary,
    storage
}


