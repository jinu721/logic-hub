"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const uploadFile = (file, type) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            resource_type: type === 'video' || type === 'audio' || type === 'voice' ? 'video' : 'image',
            folder: "chat_media",
            timeout: 60000
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve((result === null || result === void 0 ? void 0 : result.secure_url) || '');
            }
        });
        const readable = stream_1.Readable.from(file.buffer);
        readable.pipe(uploadStream);
    });
};
exports.uploadFile = uploadFile;
