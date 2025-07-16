import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { X, Save } from "lucide-react";
import { axiosInstance } from "@/services/apiServices";
import { useToast } from "@/context/Toast";
import GroupForm from "./GroupForm";
import { GroupIF } from "@/types/group.types";
import { UserIF } from "@/types/user.types";


type GroupModalProps = {
  group?: GroupIF;
  onClose: () => void;
  onSave: (updatedGroup: GroupIF, isEdit: boolean) => Promise<void>;
  isEdit: boolean;
  onDelete: (id: string) => void;
};

const GroupModal: React.FC<GroupModalProps> = ({
  group,
  onClose,
  onSave,
  isEdit,
  onDelete,
}) => {
  const initialFormState: GroupIF = {
    _id: group?._id || "",
    name: group?.name || "",
    description: group?.description || "",
    groupType: group?.groupType || "public-open",
    isDeleted: group?.isDeleted || false,
    image: group?.image || null,
    createdBy: group?.createdBy as UserIF,
    members: group?.members as UserIF[],
    admins: group?.admins as UserIF[],
    userRequests: group?.userRequests || [],
    createdAt: group?.createdAt || new Date().toISOString(),
  };

  const [formData, setFormData] = useState<GroupIF>(initialFormState);
  const [mode, setMode] = useState<"view" | "edit" | "create">(
    isEdit ? "view" : "create"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast() as any;

  useEffect(() => {
    setFormData({
      _id: group?._id || "",
      name: group?.name || "",
      description: group?.description || "",
      groupType: group?.groupType || "public-open",
      isDeleted: group?.isDeleted || false,
      image: group?.image || null,
      createdBy: group?.createdBy as UserIF,
      members: group?.members as UserIF[],
      admins: group?.admins as UserIF[],
      userRequests: group?.userRequests || [],
      createdAt: group?.createdAt || new Date().toISOString(),
    });
    setMode(isEdit ? "view" : "create");
    setErrors({});
    setDeleteConfirm(false);
  }, [group, isEdit]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const updatedValue =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value;

    setFormData({
      ...formData,
      [name]: updatedValue,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Group name is required";
    if (!formData.description)
      newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setIsLoading(false);
      setErrors(newErrors);
      return;
    }

    let imageUrl = formData.image;

    if (selectedImageFile) {
      const imageFormData = new FormData();
      imageFormData.append("groupImage", selectedImageFile);

      try {
        const response = await axiosInstance.post(
          "/groups/image",
          imageFormData
        );
        imageUrl = response.data.imageUrl;
      } catch (err) {
        setIsLoading(false);
        console.error("Image upload failed", err);
        showToast({
          type: "error",
          message: "Image upload failed",
          duration: 3000,
        });
        return;
      }
    }

    const finalData: GroupIF = {
      ...formData,
      image: imageUrl,
    };

    try {
      await onSave(finalData, isEdit);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      showToast({
        type: "error",
        message: "Failed to save group",
        duration: 3000,
      });
    }
  };

  const handleEdit = () => {
    setMode("edit");
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const imageURL = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: imageURL,
      }));
    }
  };

  const handleDeleteClick = () => {
    if (deleteConfirm) {
      if (formData._id) {
        onDelete(formData._id);
        onClose();
      }
    } else {
      setDeleteConfirm(true);
    }
  };

  const totalMemberCount =
    (formData.members?.length || 0) +
    (formData.admins?.length || 0) +
    (formData.createdBy ? 1 : 0);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-indigo-900/30 rounded-xl overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in duration-300">
        <div className="bg-gray-800/70 px-6 py-4 flex justify-between items-center border-b border-indigo-900/30">
          <h3 className="text-xl font-bold text-white">
            {mode === "edit"
              ? "Edit Group"
              : isEdit
              ? "Group Details"
              : "Create Group"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <GroupForm
              formData={formData}
              mode={mode}
              errors={errors}
              totalMemberCount={totalMemberCount}
              deleteConfirm={deleteConfirm}
              handleChange={handleChange}
              handleImageChange={handleImageChange}
              handleEdit={handleEdit}
              handleDeleteClick={handleDeleteClick}
              setFormData={setFormData}
            />
          </form>
        </div>

        {mode !== "view" && (
          <div className="bg-gray-800/70 border-t border-indigo-900/30 px-6 py-4 flex justify-end">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-5 py-2 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2 rounded-lg flex items-center transition-all duration-200 shadow-lg shadow-indigo-600/20"
              >
                <Save size={18} className="mr-2" />
                {isLoading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupModal;
