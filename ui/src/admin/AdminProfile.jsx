import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminProfile = () => {
  const { profile, refresh } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) { toast.error("Please select an image first."); return; }
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("ProfilePicture", selectedFile);
      const res = await fetch("/api/user/profile-picture", { method: "PUT", headers: { Authorization: token }, credentials: "include", body: formData });
      const data = await res.json();
      if (res.ok) { toast.success("Profile picture updated!"); setAvatarPreview(null); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; await refresh(); }
      else toast.error(data.msg || "Upload failed");
    } catch { toast.error("Server error."); } finally { setUploading(false); }
  };

  const handleCancel = () => { setAvatarPreview(null); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; };
  const displaySrc = avatarPreview || (profile?.avatarBase64 ? `data:image/jpeg;base64,${profile.avatarBase64}` : null);

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-5">
          <div className="relative group shrink-0">
            {displaySrc ? (
              <img src={displaySrc} alt="Admin avatar" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">{profile?.username?.[0]?.toUpperCase() || "A"}</div>
            )}
            <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-lg" title="Change photo">📷</button>
          </div>
          <div>
            <h2 className="text-lg font-bold">{profile?.username}</h2>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <span className="inline-block mt-1 text-xs bg-black text-white px-2 py-1 rounded-full">{profile?.userRole}</span>
          </div>
        </div>
        <div className="pt-4 border-t">
          <p className="text-sm font-medium text-gray-700 mb-3">Profile Picture</p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">Choose Photo</button>
            {avatarPreview && (
              <>
                <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50 transition">{uploading ? "Uploading..." : "Save Photo"}</button>
                <button onClick={handleCancel} className="px-4 py-2 text-sm text-red-500 hover:underline">Cancel</button>
              </>
            )}
          </div>
          {avatarPreview && <p className="text-xs text-gray-400 mt-2">Preview shown above — click Save Photo to confirm.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
