
import React, { useState, useRef } from "react";
import { FolderPlus, Upload } from "lucide-react";
import api from "../../utils/axiosInstance";

function NewItemModal(props) {
    const { isOpen, onClose, parentId, onItemCreated } = props;
    const [folderName, setFolderName] = useState("");
    const fileInputRef = useRef(null);

    async function handleCreateFolder() {
        if (folderName.trim() === "") return;

        try {
            let res = await api.post("/folder", { name: folderName, parentId: parentId });
            console.log("response of creating folder api is : ",res);
            setFolderName("");
            if (onItemCreated) onItemCreated();
            onClose();
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    }

    async function handleFileUpload(event) {
        const files = Array.from(event.target.files);
        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("file", files[i]);
                formData.append("parentId", parentId); // add parentId as form field

                let res = await api.post("/file", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log("res of file upload on newItem modal is :  ", res);
            }
            if (onItemCreated) onItemCreated();
            onClose();
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    }


    function openFileDialog() {
        fileInputRef.current.click();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-gray-100 rounded-lg p-6 w-96">
                <h3 className="text-lg font-semibold mb-4">Create New</h3>

                <div className="space-y-4">
                    {/* Create Folder */}
                    <div>
                        <input
                            type="text"
                            placeholder="Folder name"
                            value={folderName}
                            onChange={function (e) { setFolderName(e.target.value); }}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                            onKeyPress={function (e) { if (e.key === "Enter") handleCreateFolder(); }}
                        />
                        <button
                            onClick={handleCreateFolder}
                            disabled={folderName.trim() === ""}
                            className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-500 transition-colors flex items-center justify-center space-x-2"
                        >
                            <FolderPlus className="w-4 h-4" />
                            <span>Create Folder</span>
                        </button>
                    </div>

                    {/* Upload Files */}
                    <div className="border-t border-gray-600 pt-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <button
                            onClick={openFileDialog}
                            className="w-full bg-gray-700 text-gray-200 py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                        >
                            <Upload className="w-4 h-4" />
                            <span>Upload Files</span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewItemModal;
