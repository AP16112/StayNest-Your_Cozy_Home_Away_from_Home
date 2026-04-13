// Here we created this cloudConfig.js file to configure our cloudinary account here, so that we can use this configuration in our route file where we want to handle the file upload and then store that file in cloudinary and then store the URL of that image in our database.
// So here we will require the cloudinary library and then we will configure our cloudinary account here using the credentials that we get from our cloudinary account dashboard and then we will export this cloudinary configuration here, so that we can use this configuration in our route file where we want to handle the file upload and then store that file in cloudinary and then store the URL of that image in our database.

// So here we will use this cloudinary configuration in our route file where we want to handle the file upload and then store that file in cloudinary and then store the URL of that image in our database, so that we can keep our route file clean and easy to read and also easy to maintain.

// Here we are required the cloudinary library and then we will configure our cloudinary account here using the credentials that we get from our cloudinary account dashboard and then we will export this cloudinary configuration here, so that we can use this configuration in our route file where we want to handle the file upload and then store that file in cloudinary and then store the URL of that image in our database. So here we will use this cloudinary configuration in our route file where we want to handle the file upload and then store that file in cloudinary and then store the URL of that image in our database, so that we can keep our route file clean and easy to read and also easy to maintain.
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Now we will configure our cloudinary account here using the credentials that we get from our cloudinary account dashboard
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET   
});
// Here these 'cloud_name', 'api_key' and 'api_secret' are the default names that present in the config() method of cloudinary library, so we need to use these default names only for these credentials that we get from our cloudinary account dashboard, so that cloudinary library can recognize these credentials and then we can use this configuration to store our files in cloudinary and then store the URL of that image in our database and whenever we want to access that image, we can access it using that URL which is stored in the database.

// Here this is new cloudinary storage engine for multer, so here we are creating a new instance of CloudinaryStorage and then we will pass the cloudinary configuration that we have created above and then we will specify the folder name in which we want to store our images in cloudinary and then we will specify the format of the image that we want to store in cloudinary and then we will specify the public_id of the image that we want to store in cloudinary. So here we are using this storage engine in our route file where we want to handle the file upload and then store that file in cloudinary and then store the URL of that image in our database, so that we can keep our route file clean and easy to read and also easy to maintain.
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'staynest_DEV', // here we are specifying the folder name in which we want to store our images in cloudinary, so that all our images will be stored in this folder in cloudinary and then we can easily access those images from that folder in cloudinary.
        allowed_formats: [ 'jpeg', 'png', 'jpg'], // here we are specifying the format of the image that we want to store in cloudinary, so that only images with these formats will be stored in cloudinary and then we can easily access those images from cloudinary.
    },
});


module.exports = {
    cloudinary,
    storage
};
// Here we are exporting this cloudinary configuration here, so that we can use this configuration in our route file where we want to handle the file upload and then store that file in cloudinary and then store the URL of that image in our database, so that we can keep our route file clean and easy to read and also easy to maintain. So here we will use this cloudinary configuration in our route file where we want to handle the file upload and then store that file in cloudinary and then store the URL of that image in our database, so that we can keep our route file clean and easy to read and also easy to maintain.

// Now we will use them inside 'listing.js' file inside routes folder where we want to handle the file upload and then store that file in cloudinary and then store the URL of that image in our database, so that we can keep our route file clean and easy to read and also easy to maintain. So here we will use this cloudinary configuration in our route file where we want to handle the file upload and then store that file in cloudinary and then store the URL of that image in our database, so that we can keep our route file clean and easy to read and also easy to maintain.


