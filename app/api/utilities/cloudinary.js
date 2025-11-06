import { promises as fs } from 'fs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFile = async (sourceFile, additionalUploadOptions = {}) => {
    const { path: tempPath } = sourceFile;

    const uploadResult = await cloudinary.uploader.upload(tempPath, {
        asset_folder: 'master_thesis',
        resource_type: 'image',
        ...additionalUploadOptions,
    });

    if (tempPath) {
        try {
            await fs.unlink(tempPath);
        } catch {}
    }

    return uploadResult.secure_url;
};
