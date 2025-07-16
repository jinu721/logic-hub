import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export const uploadFile = (file: Express.Multer.File, type: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: type === 'video' || type === 'audio' ? 'video' : 'image',
        folder: "chat_media", 
        timeout: 60000 
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || '');
        }
      }
    );

    const readable = Readable.from(file.buffer);
    readable.pipe(uploadStream);
  });
};
