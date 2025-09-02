import React, { useState } from "react";
import { Folder, File } from "lucide-react";
import ItemContextMenu from "./ItemContextMenu";

function FileIcon({ type }) {
    return type === "folder" ? (
        <Folder className="h-5 w-5 text-yellow-400" />
    ) : (
        <File className="h-5 w-5 text-blue-400" />
    );
}

function ItemGrid({ items, viewMode, onItemClick, onItemDoubleClick, onItemAction, selectedItems }) {
    const [contextMenu, setContextMenu] = useState(null);

    // Right-click context menu
    const handleContextMenu = (event, item) => {
        event.preventDefault();
        setContextMenu({
            item,
            position: { x: event.pageX, y: event.pageY },
        });
        // Optional: select item on right-click
        if (!selectedItems.some(x => x.id === item.id)) {
            onItemClick(item);
        }
    };

    // Single click → select item
    const handleSelect = (item, event) => {
        if (event.type === "contextmenu") return; // ignore right-click
        onItemClick(item);
    };

    // Double click → open folder/file
    const handleOpen = (item) => {
        onItemDoubleClick(item);
    };

    const ListHeader = (
        <div className="grid grid-cols-4 gap-4 p-2 font-medium text-gray-300 border-b border-gray-700">
            <div>Name</div>
            <div>Owner</div>
            <div>Last Modified</div>
            <div>Size</div>
        </div>
    );

    if (viewMode === "list") {
        return (
            <div className="bg-gray-800 rounded-lg p-2 relative">
                {ListHeader}
                {items.map(item => (
                    <div
                        key={item.id}
                        className={`item-card grid grid-cols-4 gap-4 p-2 cursor-pointer hover:bg-gray-700 transition ${selectedItems.some(x => x.id === item.id) ? "bg-gray-700" : ""
                            }`}
                        onClick={(e) => handleSelect(item, e)}
                        onDoubleClick={() => handleOpen(item)}
                        onContextMenu={(e) => handleContextMenu(e, item)}
                    >
                        <div className="flex items-center space-x-2">
                            <FileIcon type={item.type} />
                            <span className="truncate">{item.name}</span>
                        </div>
                        <div>{item.owner || "You"}</div>
                        <div>{item.modifiedAt || "-"}</div>
                        <div>{item.size || "-"}</div>
                    </div>
                ))}

                {contextMenu && (
                    <ItemContextMenu
                        item={contextMenu.item}
                        position={contextMenu.position}
                        onClose={() => setContextMenu(null)}
                        onAction={onItemAction}
                    />
                )}
            </div>
        );
    }

    // Grid view
    return (
        <div className=" item-card grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 relative">
            {items.map(item => (
                <div
                    key={item.id}
                    className={`border border-gray-700 rounded-lg p-4 bg-gray-800 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center text-center ${selectedItems.some(x => x.id === item.id) ? "border-blue-500" : ""
                        }`}
                    onClick={(e) => handleSelect(item, e)}
                    onDoubleClick={() => handleOpen(item)}
                    onContextMenu={(e) => handleContextMenu(e, item)}
                >
                    <FileIcon type={item.type} />
                    <p className="truncate mt-2">{item.name}</p>
                </div>
            ))}

            {contextMenu && (
                <ItemContextMenu
                    item={contextMenu.item}
                    position={contextMenu.position}
                    onClose={() => setContextMenu(null)}
                    onAction={onItemAction}
                />
            )}
        </div>
    );
}

export default ItemGrid;
