import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, '/tmp'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const IMAGE_MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']);

const fileFilter = (req, file, cb) => {
    if (!IMAGE_MIME.has(file.mimetype)) {
        return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
};

const uploadSingle = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).single('file');

export default uploadSingle;
