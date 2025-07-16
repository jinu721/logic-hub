import React, { useState, useCallback } from 'react';
import { X, ImageIcon, Sparkles, ArrowUp } from 'lucide-react';

interface ImagePreviewProps {
  selectedImagePreview: string;
  onSendImage: (description: string, croppedImg?: string) => void;
  onReset: () => void;
  isUploading?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  selectedImagePreview,
  onReset,
  onSendImage,
  isUploading = true
}) => {
  const [imageDescription, setImageDescription] = useState<string>('');

  const handleSendImage = useCallback(() => {
    onSendImage(imageDescription, selectedImagePreview);
  }, [imageDescription, selectedImagePreview, onSendImage]);

  if (isUploading) {
    return (
      <div className="w-full rounded-3xl shadow-xl border border-gray-800 overflow-hidden">
        <div className="p-6 flex flex-col items-center justify-center h-64">
          <div className="relative mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <div className="space-y-2 text-center">
            <div className="flex items-center gap-1 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <p className="text-gray-600 font-medium">Processing your image</p>
            <p className="text-gray-400 text-sm">This will just take a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full backdrop-blur-2xl rounded-3xl shadow-xl border border-gray-700 overflow-hidden">
      <div className="p-4  bg-gradient-to-r ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-300">Image Preview</span>
          </div>
          <button onClick={onReset} className="w-7 h-7 rounded-full flex items-center justify-center transition-colors group">
            <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="relative bg-gradient-to-br rounded-2xl overflow-hidden border border-gray-700">
          <img
            src={selectedImagePreview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="relative">
          <textarea
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
            placeholder="Write a caption..."
            rows={3}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-2xl text-grey-200 placeholder-white-400 focus:outline-none resize-none text-sm leading-relaxed transition-all"
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {imageDescription.length}/280
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={handleSendImage}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none group"
        >
          <span>Send Image</span>
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowUp className="w-3 h-3" />
          </div>
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <span>Press Enter to send</span>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;