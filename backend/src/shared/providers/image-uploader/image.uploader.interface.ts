export interface IImageUploader {
  upload(file: string): Promise<{ id: string }>;
}
