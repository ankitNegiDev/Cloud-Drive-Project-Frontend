
import React, { useState } from "react";
import { Folder, File } from "lucide-react";
import ItemContextMenu from "./ItemContextMenu";

function FileIcon(props) {
    const { type } = props;
    return type === "folder" ? (
        <Folder className="h-5 w-5 text-yellow-400" />
    ) : (
        <File className="h-5 w-5 text-blue-400" />
    );
}

function ItemGrid(props) {
    const { items, viewMode, onItemClick, onItemAction } = props;
    const [contextMenu, setContextMenu] = useState(null);

    function handleContextMenu(event, item) {
        event.preventDefault();
        setContextMenu({
            item,
            position: { x: event.pageX, y: event.pageY },
        });
    }

    function handleOpen(item) {
        if (item.type === "folder") {
            onItemClick(item);
        } else {
            onItemAction("preview", item);
        }
    }

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
            <div className="bg-gray-800 rounded-lg p-2">
                {ListHeader}
                {items.map(function (item) {
                    return (
                        <div
                            key={item.id}
                            className="grid grid-cols-4 gap-4 p-2 hover:bg-gray-700 cursor-pointer"
                            onDoubleClick={function () { handleOpen(item); }}
                            onContextMenu={function (e) { handleContextMenu(e, item); }}
                        >
                            <div className="flex items-center space-x-2">
                                <FileIcon type={item.type} />
                                <span className="truncate">{item.name}</span>
                            </div>
                            <div>{item.owner || "You"}</div>
                            <div>{item.modifiedAt || "-"}</div>
                            <div>{item.size || "-"}</div>
                        </div>
                    );
                })}

                {contextMenu && (
                    <ItemContextMenu
                        item={contextMenu.item}
                        position={contextMenu.position}
                        onClose={function () { setContextMenu(null); }}
                        onAction={onItemAction}
                    />
                )}
            </div>
        );
    }

    // Grid view
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {items.map(function (item) {
                return (
                    <div
                        key={item.id}
                        className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow hover:shadow-lg transition cursor-pointer"
                        onDoubleClick={function () { handleOpen(item); }}
                        onContextMenu={function (e) { handleContextMenu(e, item); }}
                    >
                        <div className="flex items-center space-x-2">
                            <FileIcon type={item.type} />
                            <p className="truncate">{item.name}</p>
                        </div>
                    </div>
                );
            })}

            {contextMenu && (
                <ItemContextMenu
                    item={contextMenu.item}
                    position={contextMenu.position}
                    onClose={function () { setContextMenu(null); }}
                    onAction={onItemAction}
                />
            )}
        </div>
    );
}

export default ItemGrid;
