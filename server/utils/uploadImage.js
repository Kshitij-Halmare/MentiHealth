import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

export default function uploadImageCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: "auto" },  // Automatically detects file type (image, video, etc.)
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result); // Return the Cloudinary result (which includes the secure URL)
                }
            }
        ).end(buffer); // Pass the buffer to the Cloudinary uploader
    });
}
