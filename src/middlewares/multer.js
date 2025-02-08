const multer = require('multer');
const path = require('path');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

exports.setupMulter = (destinationFolder) => {
    // Allowed file types for validation
    const fileFilter = (req, file, cb) => {
        const allowedExtensions = /\.(jpeg|jpg|png|webp|svg)$/i;
        const allowedMimeTypes = /^image\/(jpeg|png|webp|svg\+xml)$/i;
        const extname = allowedExtensions.test(file.originalname.toLowerCase());
        const mimetype = allowedMimeTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true); // File is valid
        } else {
            cb(new ApiError(httpStatus.BAD_REQUEST, `"${file.fieldname}" is not an image file type`));
        }
    };
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationFolder);
        },
        filename: (req, file, cb) => {
            const filename = file.originalname.slice(0, file.originalname.lastIndexOf('.')) + '-';
            const ext = path.extname(file.originalname);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const finalFilename = filename + uniqueSuffix + ext;
            // Capture file path for future reference
            if (!req.uploadedFiles) {
                req.uploadedFiles = [];
            }
            req.uploadedFiles.push(path.join(destinationFolder, finalFilename));
            cb(null, finalFilename);
        },
    });
    const upload = multer({ 
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
    });
    return upload;
};
