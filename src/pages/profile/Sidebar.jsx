import React from "react";
import { User, Package, Settings, Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/api";
import { pre } from "framer-motion/client";
import { toast } from "react-toastify";

const Sidebar = () => {
  const { user,profile } = useAuth();
//   console.log(profile);

  const location = useLocation();

  // Hàm kiểm tra xem đường dẫn hiện tại có khớp với menu không
  const isActive = (path) => {
    return location.pathname === path;
  };
  const [previewImage, setPreviewImage] = React.useState("");
  const [uploading, setUploadStatus] = React.useState(false);

const handleChangeImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Preview
  const previewUrl = URL.createObjectURL(file);
  setPreviewImage(previewUrl);

  try {
    setUploadStatus(true);

    // Tạo tên file duy nhất
    const fileName = `${user.id}-${Date.now()}-${file.name}`;

    // Upload lên Storage
    const { error: uploadError } = await supabase.storage
      .from("avatar_user")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Lấy public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatar_user").getPublicUrl(fileName);

    // Update database
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    console.log("Upload thành công:", publicUrl);
    toast.success("Avatar updated successfully!");
  } catch (error) {
    console.error(error);
  } finally {
    setUploadStatus(false);
  }
};
  return (
    <div className="w-100 lg:block hidden">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
        {/* Avatar Info */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
          <div className="relative">
            <img
              src={
                previewImage ||
               profile?.avatar_url ||
                "https://github.com/shadcn.png"
              }
              alt="Avatar"
              className="w-16 h-16 rounded-full border-2 border-[#9e1c20] p-0.5 object-cover"
            />
            {/* overlay */}

            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="absolute inset-0 bg-black/10 bg-opacity-50 rounded-full cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Camera size={25} className="text-black" strokeWidth={1.5} />
              </div>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept=".png, .jpg, .jpeg"
              className="hidden"
              onChange={handleChangeImage}
            />
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-gray-900 truncate">
              {user?.user_metadata?.full_name}
            </h3>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <Link to="infomation">
            <div
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-2 ${isActive("/infomation") || isActive("/profile") ? "bg-[#9e1c20] text-white shadow-md shadow-red-200" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <User size={18} /> Personal Info
            </div>
          </Link>

          <Link to="my_order">
            <div
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-2 ${isActive("/my_order") ? "bg-[#9e1c20] text-white shadow-md shadow-red-200" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <Package size={18} /> My Orders
            </div>
          </Link>

          <Link to="settings">
            <div
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-2 ${isActive("/settings") ? "bg-[#9e1c20] text-white shadow-md shadow-red-200" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <Settings size={18} /> Settings
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
