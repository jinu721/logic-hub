import cloudinary from "@config/cloudinary.config";

export const generateSignedImageUrl = (
  publicId: string,
  options: Record<string, any> = {}
) => {
  return cloudinary.v2.url(publicId, {
    type: "authenticated",
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 10,
    ...options,
  });
};
