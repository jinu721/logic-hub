import React, { ChangeEvent, Dispatch, SetStateAction} from "react";
import { Upload, Link, Check, Wand2, X, Crop, RotateCcw, Save } from "lucide-react";

interface FilterOption {
  name: string;
  label: string;
}

interface Errors {
  image?: string;
}

interface Props {
  isEditingImage: boolean;
  setIsEditingImage: (val: boolean) => void;
  imageSelectionMethod: "upload" | "link";
  setImageSelectionMethod: (val: "upload" | "link") => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  handleUrlSubmit: () => void;
  errors: Errors;
  editedImageUrl: string | null;
  setEditedImageUrl: Dispatch<SetStateAction<string | null>>;
  originalImageUrl: string | null;
  resetImageEdits: () => void;
  filterOptions: FilterOption[];
  currentFilter: string;
  setCurrentFilter: (val: string) => void;
  currentBrightness: number;
  setCurrentBrightness: (val: number) => void;
  currentContrast: number;
  setCurrentContrast: (val: number) => void;
  currentSaturation: number;
  setCurrentSaturation: (val: number) => void;
  applyImageEdits: () => void;
  cropMode: boolean;
  startCropMode: () => void;
  cancelCrop: () => void;
  applyCrop: () => void;
  handleCropStart: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleCropMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleCropEnd: (e: React.MouseEvent<HTMLDivElement>) => void;
  cropSettings: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
  imageRef: React.RefObject<HTMLImageElement | null>;
  cropCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  getImageStyle: () => React.CSSProperties;
}

const ImageEditorForm: React.FC<Props> = ({
  isEditingImage,
  setIsEditingImage,
  imageSelectionMethod,
  setImageSelectionMethod,
  fileInputRef,
  handleFileUpload,
  imageUrl,
  setImageUrl,
  handleUrlSubmit,
  errors,
  editedImageUrl,
  setEditedImageUrl,
  originalImageUrl,
  resetImageEdits,
  filterOptions,
  currentFilter,
  setCurrentFilter,
  currentBrightness,
  setCurrentBrightness,
  currentContrast,
  setCurrentContrast,
  currentSaturation,
  setCurrentSaturation,
  applyImageEdits,
  cropMode,
  startCropMode,
  cancelCrop,
  applyCrop,
  handleCropStart,
  handleCropMove,
  handleCropEnd,
  cropSettings,
  imageRef,
  cropCanvasRef,
  getImageStyle,
}) => {


 

  return (
    <div className="space-y-4">
      {!isEditingImage ? (
        <div className="bg-gray-750 p-4 rounded-md border border-gray-600 shadow">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Image</h3>

          <div className="mb-3">
            <div className="flex space-x-2 mb-3">
              <button
                onClick={() => setImageSelectionMethod("upload")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center transition-all ${
                  imageSelectionMethod === "upload"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
                type="button"
              >
                <Upload size={12} className="mr-1.5" /> Upload
              </button>
              <button
                onClick={() => setImageSelectionMethod("link")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center transition-all ${
                  imageSelectionMethod === "link"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
                type="button"
              >
                <Link size={12} className="mr-1.5" /> URL
              </button>
            </div>

            {imageSelectionMethod === "upload" && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  className="flex justify-center items-center border-2 border-dashed border-gray-500 rounded-md p-6 h-32 bg-gray-700/50 cursor-pointer hover:border-blue-500 transition-all"
                  onClick={() => fileInputRef?.current?.click()}
                >
                  <div className="text-center">
                    <Upload size={28} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload image</p>
                  </div>
                </div>
              </div>
            )}

            {imageSelectionMethod === "link" && (
              <div className="space-y-3">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter image URL..."
                    className="flex-1 bg-gray-700 text-white px-3 py-2 w-1 rounded-l-md border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 rounded-r-md bg-blue-600 text-white flex items-center hover:bg-blue-500 transition-all"
                    onClick={handleUrlSubmit}
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>
            )}

            {errors.image && (
              <p className="text-red-500 text-xs mt-2">{errors.image}</p>
            )}
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-400">Preview</p>
              {editedImageUrl && (
                <button
                  onClick={() => setIsEditingImage(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                  type="button"
                >
                  <Wand2 size={10} className="mr-1" /> Edit
                </button>
              )}
            </div>
            <div className="bg-gray-700 rounded-md p-3 flex justify-center shadow-inner">
              <div className="w-20 h-20 flex items-center justify-center">
                {editedImageUrl ? (
                  <img
                    src={editedImageUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-600 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-gray-500 text-xl shadow-inner">
                    ?
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-750 p-4 rounded-md border border-gray-600 shadow">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-300">Edit Image</h3>
            <button
              onClick={() => setIsEditingImage(false)}
              className="text-gray-400 hover:text-white"
              type="button"
            >
              <X size={14} />
            </button>
          </div>

          <div
            className="bg-gray-800 rounded-md p-3 flex justify-center shadow-inner mb-4 relative"
            onMouseDown={cropMode ? handleCropStart : undefined}
            onMouseMove={cropMode ? handleCropMove : undefined}
            onMouseUp={cropMode ? handleCropEnd : undefined}
            onMouseLeave={cropMode ? handleCropEnd : undefined}
          >
            {editedImageUrl && (
              <>
                <img
                  ref={imageRef}
                  src={editedImageUrl}
                  alt="Edit preview"
                  className="w-full h-32 object-contain"
                  style={getImageStyle()}
                  crossOrigin="anonymous"
                />
                {cropMode && (
                  <div
                    className="absolute border-2 border-blue-500 bg-opacity-20"
                    style={{
                      left: Math.min(cropSettings.startX, cropSettings.endX) + "px",
                      top: Math.min(cropSettings.startY, cropSettings.endY) + "px",
                      width: Math.abs(cropSettings.endX - cropSettings.startX) + "px",
                      height: Math.abs(cropSettings.endY - cropSettings.startY) + "px",
                    }}
                  />
                )}
              </>
            )}
            <canvas ref={cropCanvasRef} className="hidden" />
          </div>

          {!cropMode ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <button
                  className="px-2 py-1 bg-gray-600 text-xs text-white rounded flex items-center"
                  onClick={startCropMode}
                  type="button"
                >
                  <Crop size={10} className="mr-1" /> Crop
                </button>
                <button
                  className="px-2 py-1 bg-gray-600 text-xs text-white rounded flex items-center"
                  onClick={() => {
                    setEditedImageUrl(originalImageUrl);
                    resetImageEdits();
                  }}
                  type="button"
                >
                  <RotateCcw size={10} className="mr-1" /> Reset All
                </button>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Filters</label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((filter) => (
                    <button
                      key={filter.name}
                      className={`px-2 py-1 rounded text-xs ${
                        currentFilter === filter.name
                          ? "bg-blue-600 text-white"
                          : "bg-gray-600 text-gray-300"
                      }`}
                      onClick={() => setCurrentFilter(filter.name)}
                      type="button"
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Brightness: {currentBrightness}%
                </label>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={currentBrightness}
                  onChange={(e) => setCurrentBrightness(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Contrast: {currentContrast}%
                </label>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={currentContrast}
                  onChange={(e) => setCurrentContrast(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Saturation: {currentSaturation}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={currentSaturation}
                  onChange={(e) => setCurrentSaturation(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  className="px-2 py-1 bg-gray-600 text-xs text-white rounded flex items-center"
                  onClick={resetImageEdits}
                  type="button"
                >
                  <RotateCcw size={10} className="mr-1" /> Reset
                </button>
                <button
                  className="px-2 py-1 bg-blue-600 text-xs text-white rounded flex items-center"
                  onClick={applyImageEdits}
                  type="button"
                >
                  <Save size={10} className="mr-1" /> Apply
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-300">Click and drag to select crop area</p>
              <div className="flex justify-between pt-2">
                <button
                  className="px-2 py-1 bg-gray-600 text-xs text-white rounded flex items-center"
                  onClick={cancelCrop}
                  type="button"
                >
                  <X size={10} className="mr-1" /> Cancel
                </button>
                <button
                  className="px-2 py-1 bg-blue-600 text-xs text-white rounded flex items-center"
                  onClick={applyCrop}
                  type="button"
                >
                  <Crop size={10} className="mr-1" /> Apply Crop
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageEditorForm;
