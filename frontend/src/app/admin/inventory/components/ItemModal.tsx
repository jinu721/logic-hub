import React, { useState, useRef, useEffect, ChangeEvent, MouseEvent } from "react";
import { X, Plus, Edit } from "lucide-react";
import { useToast } from "@/context/Toast";
import DetailsForm from "./DetailsForm";
import ImageEditorForm from "./ImageEditorForm";
import { InventoryIF } from "@/types/inventory.types";

interface ErrorType {
  name: string;
  description: string;
  image: string;
}

interface RarityOption {
  name: string;
  color: string;
}

interface FilterOption {
  name: string;
  label: string;
}

interface CropSettings {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isDragging: boolean;
}

interface ItemModalProps {
  type: string;
  onClose: () => void;
  onSave: (item: InventoryIF, isEdit: boolean) => void;
  itemToEdit?: InventoryIF;
}

interface ToastMessage {
  type: "error" | "success" | "warning" | "info";
  message: string;
}

const ItemModal: React.FC<ItemModalProps> = ({ type, onClose, onSave, itemToEdit }) => {
  const isEditMode = !!itemToEdit;
  
  const [formData, setFormData] = useState<InventoryIF>(itemToEdit || {
    name: "",
    description: "",
    image: "",
    rarity: "Common",
    isActive: true,
  });

  const [errors, setErrors] = useState<ErrorType>({
    name: "",
    description: "",
    image: ""
  });
  
  const [imageSelectionMethod, setImageSelectionMethod] = useState<"upload" | "link">("upload");
  const [originalImageUrl, setOriginalImageUrl] = useState<string>(itemToEdit?.image || "");
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(itemToEdit?.image || null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedRarity, setSelectedRarity] = useState<"Common"|"Uncommon"|"Rare"|"Epic"|"Legendary">(itemToEdit?.rarity || "Common");
  const [isEditingImage, setIsEditingImage] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<string>("none");
  const [currentBrightness, setCurrentBrightness] = useState<number>(100);
  const [currentContrast, setCurrentContrast] = useState<number>(100);
  const [currentSaturation, setCurrentSaturation] = useState<number>(100);
  const [cropMode, setCropMode] = useState<boolean>(false);
  const [cropSettings, setCropSettings] = useState<CropSettings>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isDragging: false
  });

  const [loader, setLoader] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);

  const { showToast } = useToast() as any;

  const rarityOptions: RarityOption[] = [
    { name: "Common", color: "bg-gray-500" },
    { name: "Uncommon", color: "bg-green-600" },
    { name: "Rare", color: "bg-blue-600" },
    { name: "Epic", color: "bg-purple-600" },
    { name: "Legendary", color: "bg-yellow-600" }
  ];

  const filterOptions: FilterOption[] = [
    { name: "none", label: "Normal" },
    { name: "grayscale", label: "Grayscale" },
    { name: "sepia", label: "Sepia" },
    { name: "invert", label: "Invert" },
    { name: "blur", label: "Blur" }
  ];

  useEffect(() => {
    if (itemToEdit) {
      setFormData(itemToEdit);
      setSelectedRarity(itemToEdit.rarity);
      setOriginalImageUrl(itemToEdit.image);
      setEditedImageUrl(itemToEdit.image);
    }
  }, [itemToEdit]);

  useEffect(() => {
    return () => {
      if (originalImageUrl && originalImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(originalImageUrl);
      }
      if (editedImageUrl && editedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(editedImageUrl);
      }
    };
  }, [originalImageUrl, editedImageUrl]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    
    if (errors[name as keyof ErrorType]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setOriginalImageUrl(objectUrl);
      setEditedImageUrl(objectUrl);
    }
  };

  const handleUrlSubmit = (): void => {
    if (imageUrl) {
      loadImageWithCORS(imageUrl)
        .then((img: HTMLImageElement) => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const objectUrl = URL.createObjectURL(blob);
                setOriginalImageUrl(objectUrl);
                setEditedImageUrl(objectUrl);
                setImageUrl("");
              }
            }, 'image/jpeg', 0.95);
          }
        })
        .catch((error: Error) => {
          console.error("Failed to load image:", error);
          setErrors({...errors, image: "Failed to load image. Check the URL or CORS settings."});
        });
    }
  };
  
  const loadImageWithCORS = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; 
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = src;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ErrorType> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    
    if (!editedImageUrl) {
      newErrors.image = "Please select or upload an image";
    }
    
    setErrors(newErrors as ErrorType);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (validateForm()) {
      setLoader(true);
      try {
        let imageFile: File | null = null;
        
        if (editedImageUrl && editedImageUrl.startsWith('blob:')) {
          const blob = await fetch(editedImageUrl).then(res => res.blob());
          imageFile = new File([blob], "item-image.png", { type: blob.type });
        }

        const itemData: InventoryIF & { imageFile?: File } = {
          ...formData,
          rarity: selectedRarity,
          image: editedImageUrl || formData.image || "",
          ...(imageFile && { imageFile })
        };

        onSave(itemData, isEditMode);
        setLoader(false);
        onClose();
      } catch (err) {
        setLoader(false);
        console.log(`Error ${isEditMode ? 'updating' : 'creating'} Item: ${err}`);
        showToast({
          type: "error", 
          message: `Error ${isEditMode ? 'updating' : 'creating'} Item`
        } as ToastMessage);
      }
    }
  };


  const getImageStyle = (): React.CSSProperties => {
    if (!isEditingImage) return {}; 
    let filterString = "";
    
    if (currentFilter === "grayscale") filterString += "grayscale(100%) ";
    if (currentFilter === "sepia") filterString += "sepia(100%) ";
    if (currentFilter === "invert") filterString += "invert(80%) ";
    if (currentFilter === "blur") filterString += "blur(2px) ";
    
    filterString += `brightness(${currentBrightness}%) `;
    filterString += `contrast(${currentContrast}%) `;
    filterString += `saturate(${currentSaturation}%)`;
    
    return {
      filter: filterString
    };
  };

  const applyImageEdits = (): void => {
    if (!imageRef.current) return;
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;
      
      if (!ctx) return;
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      ctx.filter = getImageStyle().filter as string || 'none';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          if (editedImageUrl && editedImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(editedImageUrl);
          }
          
          const newImageUrl = URL.createObjectURL(blob);
          setEditedImageUrl(newImageUrl);
          setIsEditingImage(false);
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error("Canvas operation failed:", error);
      
      if (imageRef.current && imageRef.current.src) {
        fetch(imageRef.current.src)
          .then(response => response.blob())
          .then(blob => {
            const safeUrl = URL.createObjectURL(blob);
            
            loadImageWithCORS(safeUrl)
              .then(img => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.filter = getImageStyle().filter as string || 'none';
                  ctx.drawImage(img, 0, 0);
                  
                  canvas.toBlob((blob) => {
                    if (blob) {
                      if (editedImageUrl && editedImageUrl.startsWith('blob:')) {
                        URL.revokeObjectURL(editedImageUrl);
                      }
                      
                      const newImageUrl = URL.createObjectURL(blob);
                      setEditedImageUrl(newImageUrl);
                      setIsEditingImage(false);
                    }
                  }, 'image/jpeg', 0.95);
                }
              });
          })
          .catch(err => {
            console.error("Failed to recover from tainted canvas:", err);
            setIsEditingImage(false);
            setErrors({...errors, image: "Cannot edit this image due to CORS restrictions"});
          });
      }
    }
  };

  const startCropMode = (): void => {
    setCropMode(true);
    setCropSettings({
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      isDragging: false
    });
  };

  const handleCropStart = (e: MouseEvent<HTMLDivElement>): void => {
    if (!cropMode) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropSettings({
      ...cropSettings,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      isDragging: true
    });
  };

  const handleCropMove = (e: MouseEvent<HTMLDivElement>): void => {
    if (!cropMode || !cropSettings.isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
    
    setCropSettings({
      ...cropSettings,
      endX: x,
      endY: y
    });
  };

  const handleCropEnd = (): void => {
    if (!cropMode || !cropSettings.isDragging) return;
    
    setCropSettings({
      ...cropSettings,
      isDragging: false
    });
  };

  const applyCrop = (): void => {
    if (!imageRef.current || !cropCanvasRef.current) return;
    
    try {
      const img = imageRef.current;
      const canvas = cropCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      const cropX = Math.min(cropSettings.startX, cropSettings.endX);
      const cropY = Math.min(cropSettings.startY, cropSettings.endY);
      const cropWidth = Math.abs(cropSettings.endX - cropSettings.startX);
      const cropHeight = Math.abs(cropSettings.endY - cropSettings.startY);
      
      if (cropWidth < 10 || cropHeight < 10) {
        alert("Please select a larger area to crop");
        return;
      }
      
      const displayWidth = img.clientWidth;
      const displayHeight = img.clientHeight;
      const scaleX = img.naturalWidth / displayWidth;
      const scaleY = img.naturalHeight / displayHeight;
      
      canvas.width = cropWidth * scaleX;
      canvas.height = cropHeight * scaleY;
      
      ctx.drawImage(
        img,
        cropX * scaleX, cropY * scaleY,
        cropWidth * scaleX, cropHeight * scaleY,
        0, 0,
        canvas.width, canvas.height
      );
      
      canvas.toBlob((blob) => {
        if (blob) {
          if (editedImageUrl && editedImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(editedImageUrl);
          }
          
          const newImageUrl = URL.createObjectURL(blob);
          setEditedImageUrl(newImageUrl);
          setCropMode(false);
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error("Canvas crop operation failed:", error);
      setCropMode(false);
      setErrors({...errors, image: "Cannot crop this image due to CORS restrictions"});
    }
  };

  const cancelCrop = (): void => {
    setCropMode(false);
  };

  const resetImageEdits = (): void => {
    setCurrentFilter("none");
    setCurrentBrightness(100);
    setCurrentContrast(100);
    setCurrentSaturation(100);
  };

  return (
    <div className="fixed inset-0  bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-3xl border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            {isEditMode ? `Edit ${type}` : `Create New ${type}`}
          </h2>
          <button onClick={() => onClose()} className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <DetailsForm 
              formData={formData} 
              errors={errors} 
              rarityOptions={rarityOptions} 
              selectedRarity={selectedRarity} 
              handleInputChange={handleInputChange} 
              setSelectedRarity={setSelectedRarity} 
            />
            <ImageEditorForm 
              isEditingImage={isEditingImage}
              setIsEditingImage={setIsEditingImage}
              imageSelectionMethod={imageSelectionMethod}
              setImageSelectionMethod={setImageSelectionMethod}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
              handleFileUpload={handleFileUpload}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              handleUrlSubmit={handleUrlSubmit}
              errors={errors}
              editedImageUrl={editedImageUrl}
              setEditedImageUrl={setEditedImageUrl}
              imageRef={imageRef}
              originalImageUrl={originalImageUrl}
              resetImageEdits={resetImageEdits}
              filterOptions={filterOptions}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              currentBrightness={currentBrightness}
              setCurrentBrightness={setCurrentBrightness}
              currentContrast={currentContrast}
              setCurrentContrast={setCurrentContrast}
              currentSaturation={currentSaturation}
              setCurrentSaturation={setCurrentSaturation}
              applyImageEdits={applyImageEdits}
              cropMode={cropMode}
              startCropMode={startCropMode}
              cancelCrop={cancelCrop}
              applyCrop={applyCrop}
              handleCropStart={handleCropStart}
              handleCropMove={handleCropMove}
              handleCropEnd={handleCropEnd}
              cropSettings={cropSettings}
              cropCanvasRef={cropCanvasRef}
              getImageStyle={getImageStyle}
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end space-x-3">
          <button onClick={() => onClose()} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-all text-sm font-medium">
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-all text-sm font-medium flex items-center"
            onClick={handleSubmit}
            disabled={loader}
          >
            {loader ? (
              <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
            ) : (
              <div className="flex items-center">
                {isEditMode ? <Edit size={14} className="mr-1.5" /> : <Plus size={14} className="mr-1.5" />}
                <span>{isEditMode ? 'Update Item' : 'Create Item'}</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;