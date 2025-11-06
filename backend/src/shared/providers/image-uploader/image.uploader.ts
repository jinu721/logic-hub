import cloudinary from "@config/cloudinary.config";
import { IImageUploader } from "./image.uploader.interface";

export class ImageUploader implements IImageUploader {
  async upload(file: string): Promise<{ id: string }> {
    const uploadResult = await cloudinary.v2.uploader.upload(file, {
      folder: "inventory",
      type: "authenticated",
    });

    return { id: uploadResult.public_id };
  }
}
