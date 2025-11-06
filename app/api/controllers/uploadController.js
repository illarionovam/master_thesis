import { saveFile } from '../utilities/cloudinary.js';
import createHttpError from 'http-errors';

const uploadImage = async (req, res) => {
    if (!req.file) {
        throw createHttpError(400, 'No file provided');
    }
    const url = await saveFile(req.file);
    res.json({ url });
};

export default {
    uploadImage,
};
