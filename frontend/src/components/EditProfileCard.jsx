import { useState } from "react";
import { ProfileStore } from "../store/profile.store";

const EditProfileCard = ({ onClose, initialProfile }) => {

    const { UpdateProfile , isUpdatingProfile } = ProfileStore();

    const [fullName, setFullName] = useState(initialProfile.fullName);
    const [about, setAbout] = useState(initialProfile.about);

    const handleSave = async(fullName,about) => {
        UpdateProfile({fullName,about})
        onClose(); 
    };

    return (
        <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">Edit Profile</h2>

        {/* Full Name Input */}
        <div className="flex flex-col">
            <label className="text-gray-400 text-sm">Full Name</label>
            <input
            type="text"
            className="p-2 rounded bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            />
        </div>

        {/* About Input */}
        <div className="flex flex-col">
            <label className="text-gray-400 text-sm">About</label>
            <textarea
            className="p-2 rounded bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
            <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
            onClick={onClose}
            >
            Cancel
            </button>
            <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={()=>{
                handleSave(fullName,about);
            }} 
            >
            Save
            </button>
        </div>
        </div>
    );
};

export default EditProfileCard;
