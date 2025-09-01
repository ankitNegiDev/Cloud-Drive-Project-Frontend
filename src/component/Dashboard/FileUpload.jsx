
import React, { useState, useRef } from "react";
import api from "../../utils/axiosInstance";

function FileUpload(props) {
    const { parentId, onUploadComplete, children } = props;
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    function handleDragOver(event) {
        event.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setIsDragging(false);
    }
    async function handleDrop(event) {
        event.preventDefault();
        setIsDragging(false);

        const files = Array.from(event.dataTransfer.files);
        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append("file", files[i]);
            formData.append("parentId", parentId);

            let res = await api.post("/file", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("response of upload file API on dashboard when dropping:", res);
        }
        if (onUploadComplete) onUploadComplete();
    }

    async function handleFileSelect(event) {
        const files = Array.from(event.target.files);
        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append("file", files[i]);
            formData.append("parentId", parentId);

            let res = await api.post("/file", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("res of upload file API on dashboard when select is:", res);
        }
        event.target.value = "";
        if (onUploadComplete) onUploadComplete();
    }

    function openFileDialog() {
        fileInputRef.current.click();
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={"relative " + (isDragging ? "bg-blue-50 border-2 border-dashed border-blue-300" : "")}
        >
            {isDragging && (
                <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center z-10">
                    <div className="text-blue-700 font-medium">Drop files here to upload</div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
            />

            {children && React.cloneElement(children, { onClick: openFileDialog })}
        </div>
    );
}

export default FileUpload;
