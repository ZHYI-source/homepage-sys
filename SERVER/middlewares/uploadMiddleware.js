const multer = require('multer');
const path = require('path');
const fs = require('fs');


function createFolder(folderPath) {
    const folders = folderPath.split(path.sep);
    let currentPath = '';

    folders.forEach((folder) => {
        currentPath = path.join(currentPath, folder);
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
        }
    });
}

/**
 * 文件上传中间件
 * @param {string} uploadPath - 文件上传的目标路径
 * @param {string} fieldName - 上传文件的字段名 默认值：file 通过req.file取到
 * @returns {Function} - Express 中间件函数
 */
function uploadMiddleware(uploadPath, fieldName = 'file') {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            let destination;
            if (file.mimetype.startsWith('image/') && file.mimetype !== 'image/svg+xml') {
                destination = path.join(uploadPath, 'images');
            } else if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
                destination = path.join(uploadPath, 'media');
            } else {
                destination = path.join(uploadPath, 'files');
            }
            createFolder(destination);
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const extension = path.extname(file.originalname);
            const newFilename = `${timestamp}${extension}`;
            cb(null, newFilename);
        }
    });

    const upload = multer({storage});

    return upload.single(fieldName);
}


module.exports = {uploadMiddleware};
