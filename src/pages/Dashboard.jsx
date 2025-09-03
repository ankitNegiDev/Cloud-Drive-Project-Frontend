




// src/pages/Dashboard.jsx
import { useState, useEffect, useContext, useCallback } from "react";
import api from "../utils/axiosInstance";
import AuthContext from "../context/AuthContext";

import Sidebar from "../component/Dashboard/Sidebar";
import DashboardHeader from "../component/Dashboard/DashboardHeader";
import Breadcrumbs from "../component/Dashboard/Breadcrumbs";
import FileUpload from "../component/Dashboard/FileUpload";
import NewItemModal from "../component/Dashboard/NewItemModal";
import ItemGrid from "../component/Dashboard/ItemGrid";

import ConfirmDialog from "../component/Dashboard/ConfirmDialog";
import toast from "react-hot-toast";
import RenameModal from "../component/Dashboard/RenameModal";
import PreviewModal from "../component/Dashboard/PreviewModal";
import MoveDialog from "../component/Dashboard/MoveDialog";
import { useNavigate } from "react-router-dom";

// icons for action bar
import {
    X,
    UserPlus,
    Download,
    FolderOpen,
    Trash2,
    Link,
    MoreVertical,
} from "lucide-react";
import ShareModal from "../component/Dashboard/ShareModal";

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    console.log("user on dashboard page from auth is : ", user);

    const [items, setItems] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);

    const [loading, setLoading] = useState(false);

    // this state is for which tab is active means if user click on recent that means active tab is recent one..my-drive | shared-with-me | recent | starred | trash
    const [activeSection, setActiveSection] = useState("my-drive");


    // this state is for setting the text that will user write in the search box.
    const [searchQuery, setSearchQuery] = useState("");


    // this state is for managing the list/grid view
    const [viewMode, setViewMode] = useState("grid");

    // this state is for mainging the opening and closing of the modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // this state is for breadcrumbs navigation --
    const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "Root" }]);

    // this state is for selecting the file/folder
    const [selectedItems, setSelectedItems] = useState([]);

    // this state is for sharing
    const [shareItem, setShareItem] = useState(null);



    // action modals
    const [renameTarget, setRenameTarget] = useState(null);
    const [moveTarget, setMoveTarget] = useState(null);
    const [previewTarget, setPreviewTarget] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);



    // Sidebar -- api cals logic
    const fetchItems = useCallback(async function () {
        try {
            setLoading(true);

            let res;

            if (activeSection === "my-drive") {
                // call items route -- by default it will show what's on home routes
                res = await api.get("/items", {
                    params: { parentId: currentFolderId },
                });

                console.log("response of get api for items and checking signed url : ",res);

            } else if (activeSection === "shared-with-me") {
                //shared route
                res = await api.get("/shares/shared-with-me");
                console.log("response of shared with me api is : ", res);

            } else if (activeSection === "trash") {
                // trash route
                res = await api.get("/trash");
                console.log("response of trash api is : ", res);

            } else if (activeSection === "recent") {
                //todo => future API
                res = { data: { data: [] } };

            } else if (activeSection === "starred") {
                //todo  future API
                res = { data: { data: [] } };

            } else if (activeSection === "home") {
                //no API, just clear items (or redirect if you have a homepage)
                setItems([]);
                return;
            }

            setItems(res?.data?.data || []);
        } catch (error) {
            console.error("Error fetching items:", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [activeSection, currentFolderId]);

    useEffect(
        function () {
            fetchItems();
        },
        [fetchItems]
    );

    // function handleSectionChange(sectionId) {
    //     setActiveSection(sectionId);
    //     //todo => on dashboard page based on section id we can call api -- either for starred , trash , shared with me etc
    //     setCurrentFolderId(null);
    //     setBreadcrumbs([{ id: null, name: "Root" }]);
    // }


    function handleSectionChange(sectionId) {
        setActiveSection(sectionId);

        if (sectionId === "my-drive") {
            setCurrentFolderId(null);
            setBreadcrumbs([{ id: null, name: "Root" }]);
        } else if (sectionId === "home") {
            // navigate to the Home page
            navigate("/");
            return;
        } else {
            // shared-with-me / trash etc - flat lists (no folder nav)
            setCurrentFolderId(null);
            setBreadcrumbs([{ id: null, name: sectionId }]);
        }
    }

    //Todo => an api call for search since dashboard header only update the searchQuery state so based on this we need to call our search api -- // GET /api/search?query=&type=&parentId=&limit=&offset= ====>  searchRouter.get('/', authMiddleware, searchItemsController);

    // --- search bar logicc ---
    /*
    useEffect(function () {
        async function performSearch() {
            try {
                if (!searchQuery || searchQuery.trim() === "") {
                    // if search box is cleared → reload normal items
                    fetchItems();
                    return;
                }

                setLoading(true);
                const res = await api.get("/search", {
                    params: { query: searchQuery }
                });
                console.log("data of search api is : ",res);
                setItems(res.data.data || []);
            } catch (error) {
                console.error("Error in search:", error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        }

        performSearch();
    }, [searchQuery, fetchItems]);
    */

    useEffect(function () {
        if (!searchQuery || searchQuery.trim() === "") {
            fetchItems(); // reset to normal items if search box is empty
            return;
        }

        const delay = 500; // 500ms debounce delay
        const handler = setTimeout(function () {
            (async function () {
                try {
                    setLoading(true);
                    const res = await api.get("/search", {
                        params: { query: searchQuery }
                    });
                    console.log("res of debounced search api is : ", res);
                    setItems(res.data.data || []);
                } catch (error) {
                    console.error("Error in search:", error);
                    setItems([]);
                } finally {
                    setLoading(false);
                }
            })();
        }, delay);

        // cleanup its imp to  clear the timeout if searchQuery changes before 500ms else we will not -- it simply means suppose user want to search mango and he type m and stop for 200ms so timer is having time 200ms and again he type ang  then we need to now clear the previous timer and run the new timer becuse if we don't clear previous on it will end up in calling multiple api.
        return function () {
            clearTimeout(handler);
        };

    }, [searchQuery, fetchItems]);

    // search when user press enter key
    function handleSearchKeyDown(event) {
        if (event.key === "Enter") {
            // call search immediately without waiting for debounce when user press the enter key
            fetchItems();
        }
    }

    // ---- search logic ends here -------





    // this is for setting the folder id,name into the breadcrubms state when user click on any folder.
    /*
    function handleItemClick(item) {
        if (item.type === "folder") {
            setCurrentFolderId(item.id);
            setBreadcrumbs([...breadcrumbs, { id: item.id, name: item.name }]);
        } else {
            // open preview for files
            setPreviewTarget(item);
        }
    }
    */
    function handleItemClick(item) {
        if (!item) {
            setSelectedItems([]);
            return;
        }

        // Always select clicked item (single selection)
        console.log("selected item is : ",item);
        setSelectedItems([item]);
    }


    function handleItemDoubleClick(item) {
        if (item.type === "folder") {
            // Navigate into folder
            setCurrentFolderId(item.id);
            setBreadcrumbs([...breadcrumbs, { id: item.id, name: item.name }]);
        } else {
            // Open preview modal for file
            setPreviewTarget(item);
        }
    }


    // logic for handling the navigation -- for breadcrumb navigation...
    function handleNavigate(folderId) {
        // if folder id is null s--- show root 
        if (folderId === null) {
            setCurrentFolderId(null);
            setBreadcrumbs([{ id: null, name: "Root" }]);
        } else {
            // else first find that folder id from the breadcrumbs array and then set into the breadcrubms state... 
            let index = breadcrumbs.findIndex(function (b) {
                return b.id === folderId;
            });
            setBreadcrumbs(breadcrumbs.slice(0, index + 1));
            setCurrentFolderId(folderId);
        }
    }

    // breadcrumbs navigation ends here --------------


    // useEffect(() => {
    //     function handleClickOutside(event) {
    //         const actionBar = document.querySelector(".action-bar");
    //         if (actionBar && !actionBar.contains(event.target)) {
    //             setSelectedItems([]);
    //         }
    //     }
    //     document.addEventListener("click", handleClickOutside);
    //     return () => document.removeEventListener("click", handleClickOutside);
    // }, []);


    useEffect(() => {
        function handleClickOutside(event) {
            // Ignore clicks inside action bar
            if (event.target.closest(".action-bar")) return;

            // Ignore clicks inside any item
            if (event.target.closest(".item-card")) return;

            // Otherwise clear selection
            setSelectedItems([]);
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);




    // ---------- ACTION CALLS ----------
    async function downloadFile(item) {
        try {
            // (A) Try to get a signed URL first
            const meta = await api.get(`/file/${item.id}`);
            const url = meta?.data?.data?.url;
            if (url) {
                window.open(url, "_blank", "noopener,noreferrer");
                return;
            }
            // (B) Fallback: GET blob and force download
            const res = await api.get(`/file/${item.id}`, { responseType: "blob" });
            const blob = new Blob([res.data]);
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = item.name || "download";
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(link.href);
        } catch (e) {
            console.error(e);
            toast.error("Download failed");
        }
    }

    async function renameItem(id, type, newName) {
        try {
            if (type === "folder") {
                await api.put(`/folder/${id}`, { name: newName });
            } else {
                await api.put(`/file/${id}`, { name: newName });
            }
            toast.success("Renamed");
            await fetchItems();
        } catch (e) {
            console.error(e);
            toast.error("Rename failed");
        }
    }

    async function deleteItem(item) {
        try {
            if (item.type === "folder") {
                await api.delete(`/folder/${item.id}`);
            } else {
                await api.delete(`/file/${item.id}`);
            }
            toast.success("Moved to trash");
            await fetchItems();
        } catch (e) {
            console.error(e);
            toast.error("Delete failed");
        }
    }

    async function moveItem(itemId, type, destinationFolderId) {
        try {
            // Add these routes in backend OR change below to your actual move endpoints:
            // file:   PUT /api/file/:id/move    { parentId }
            // folder: PUT /api/folder/:id/move  { parentId }
            const url =
                type === "folder"
                    ? `/folder/${itemId}/move`
                    : `/file/${itemId}/move`;
            await api.put(url, { parentId: destinationFolderId });
            toast.success("Moved");
            await fetchItems();
        } catch (e) {
            console.error(e);
            toast.error("Move failed (add /move route in backend)");
        }
    }

    async function toggleStar(item) {
        try {
            // Backend missing. Example expected:
            // PUT /api/items/:id/star { starred: boolean }
            // For now, optimistic client update:
            setItems((prev) =>
                prev.map((x) =>
                    x.id === item.id ? { ...x, starred: !x.starred } : x
                )
            );
            toast.success(item.starred ? "Removed from Starred" : "Starred");
        } catch {
            toast.error("Star failed");
        }
    }

    // master action handler from ItemGrid/ContextMenu
    function handleItemAction(action, item) {
        switch (action) {
            case "open":
                if (item.type === "folder") {
                    handleItemClick(item);
                } else {
                    setPreviewTarget(item);
                }
                break;

            case "preview":
                setPreviewTarget(item);
                break;

            case "download":
                downloadFile(item);
                break;

            case "rename":
                setRenameTarget(item);
                break;

            case "move":
                setMoveTarget(item);
                break;

            case "star":
                toggleStar(item);
                break;

            case "delete":
                setConfirmDelete(item);
                break;

            default:
                break;
        }
    }

    function handleNewItemCreated() {
        fetchItems();
    }

    console.log("selectedItem length is : ",selectedItems);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/* Sidebar */}
            <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearchKeyDown={handleSearchKeyDown}
                    viewMode={viewMode}
                    onViewModeToggle={setViewMode}
                    onNewClick={function () {
                        setIsModalOpen(true);
                    }}
                    onSearchSubmit={fetchItems}
                />

                {selectedItems.length > 0 && (
                    <div className="action-bar flex items-center gap-4 bg-gray-800 text-gray-200 px-4 py-2 rounded-full shadow-md sticky top-2 mx-auto w-[95%] max-w-4xl z-50 mt-2">

                        {/* Clear selection */}
                        <button
                            onClick={() => setSelectedItems([])}
                            className="text-gray-400 hover:text-red-500 transition"
                        >
                            <X size={20} />
                        </button>

                        {/* Count */}
                        <span className="text-sm font-medium mr-4">
                            {selectedItems.length} selected
                        </span>

                        {/* Action icons */}
                        {/* share */}
                        <button
                            onClick={() => setShareItem(selectedItems[0])}
                            className="hover:text-white transition cursor-pointer"
                            title="Share"
                        >
                            <UserPlus size={20} />
                        </button>

                        <button
                            onClick={() => downloadFile(selectedItems[0])}
                            className="hover:text-white transition"
                            title="Download"
                        >
                            <Download size={20} />
                        </button>
                        <button
                            onClick={() => setMoveTarget(selectedItems[0])}
                            className="hover:text-white transition"
                            title="Move"
                        >
                            <FolderOpen size={20} />
                        </button>
                        <button
                            onClick={() => setConfirmDelete(selectedItems[0])}
                            className="hover:text-red-400 transition"
                            title="Delete"
                        >
                            <Trash2 size={20} />
                        </button>
                        <button className="hover:text-white transition" title="Get Link">
                            <Link size={20} />
                        </button>
                        <button className="hover:text-white transition" title="More">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                )}


                {/* this is responsible for new button modal open -- folder creation + file upload */}
                <NewItemModal
                    isOpen={isModalOpen}
                    onClose={function () {
                        setIsModalOpen(false);
                    }}
                    parentId={currentFolderId}
                    onItemCreated={handleNewItemCreated}
                />



                <div className="p-6 overflow-y-auto flex-1">
                    <Breadcrumbs path={breadcrumbs} onNavigate={handleNavigate} />

                    {/* <FileUpload parentId={currentFolderId} onUploadComplete={fetchItems}>
                        <button className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition">
                            Upload Files
                        </button>
                    </FileUpload> */}

                    {/* the upload drag and drop will be only visible on my-drive not on other tabs */}
                    {activeSection === "my-drive" && (
                        <FileUpload parentId={currentFolderId} onUploadComplete={fetchItems}>
                            <button className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition">
                                Upload Files
                            </button>
                        </FileUpload>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center h-40 text-gray-400">
                            Loading...
                        </div>
                    ) : items.length === 0 ? (
                        <p className="text-gray-500">No files or folders here.</p>
                    ) : (
                        // <ItemGrid
                        //     items={items}
                        //     viewMode={viewMode}
                        //     onItemClick={handleItemClick}
                        //     onItemAction={handleItemAction}
                        // />
                        <ItemGrid
                            items={items}
                            viewMode={viewMode}
                            selectedItems={selectedItems}  
                            onItemClick={handleItemClick}
                            onItemDoubleClick={handleItemDoubleClick}
                            onItemAction={handleItemAction} 
                        />



                    )}
                </div>
            </div>


            {/* Rename */}
            <RenameModal
                isOpen={!!renameTarget}
                initialName={renameTarget?.name || ""}
                onClose={function () {
                    setRenameTarget(null);
                }}
                onSubmit={async function (newName) {
                    await renameItem(renameTarget.id, renameTarget.type, newName);
                    setRenameTarget(null);
                }}
            />

            {/* Move */}
            <MoveDialog
                isOpen={!!moveTarget}
                currentFolderId={currentFolderId}
                onClose={function () {
                    setMoveTarget(null);
                }}
                onMove={async function (destinationFolderId) {
                    await moveItem(moveTarget.id, moveTarget.type, destinationFolderId);
                    setMoveTarget(null);
                }}
            />

            {/* Preview */}
            <PreviewModal
                isOpen={!!previewTarget}
                item={previewTarget}
                onClose={function () {
                    setPreviewTarget(null);
                }}
            />

            {/* Delete confirm */}
            <ConfirmDialog
                isOpen={!!confirmDelete}
                title="Move to trash?"
                description={`"${confirmDelete?.name || ""}" will be moved to trash.`}
                confirmText="Move to Trash"
                onCancel={function () {
                    setConfirmDelete(null);
                }}
                onConfirm={async function () {
                    await deleteItem(confirmDelete);
                    setConfirmDelete(null);
                }}
            />

            {/* share modal */}
            <ShareModal
                item={shareItem}
                isOpen={!!shareItem}
                onClose={() => setShareItem(null)}
            />

        </div>
    );
}

export default Dashboard;


