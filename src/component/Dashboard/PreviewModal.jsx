
import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";

function PreviewModal({ isOpen, item, onClose }) {
    const [url, setUrl] = useState(null);
    const [mime, setMime] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(
        function () {
            if (!isOpen || !item || item.type !== "file") return;
            async function load() {
                try {
                    setLoading(true);
                    const res = await api.get(`/file/${item.id}`);
                    const u = res?.data?.data?.url || null;
                    const m = res?.data?.data?.mimeType || null;
                    setUrl(u);
                    setMime(m);

                } catch (e) {
                    console.log("error in preview mdal is : ",e);
                    setUrl(null);
                } finally {
                    setLoading(false);
                }
            }
            load();
        },
        [isOpen, item]
    );

    if (!isOpen || !item) return null;

    const isImage = mime?.startsWith("image/");
    const isPdf = mime === "application/pdf";
    const isText = mime?.startsWith("text/");

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                    <div className="font-semibold">{item.name}</div>
                    <button className="text-gray-300 hover:text-white" onClick={onClose}>✕</button>
                </div>

                <div className="flex-1 bg-black/20 overflow-auto">
                    {loading ? (
                        <div className="p-6 text-gray-400">Loading preview…</div>
                    ) : url ? (
                        isImage ? (
                            <img src={url} alt={item.name} className="max-w-full h-auto mx-auto my-4" />
                        ) : isPdf ? (
                            <iframe title="pdf" src={url} className="w-full h-[70vh]" />
                        ) : isText ? (
                            <iframe title="text" src={url} className="w-full h-[70vh] bg-gray-950" />
                        ) : (
                            <div className="p-6 text-gray-400">
                                No inline preview for this file type.{" "}
                                <a href={url} target="_blank" rel="noreferrer" className="text-blue-400 underline">
                                    Open in new tab
                                </a>
                            </div>
                        )
                    ) : (
                        <div className="p-6 text-gray-400">No preview available.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PreviewModal;
