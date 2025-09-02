// // src/pages/Dashboard.jsx

// import { useState, useEffect, useContext } from "react";
// import api from "../utils/axiosInstance";
// import AuthContext from "../context/AuthContext";
// import { Folder, File, Loader2, Home, Users, Trash2 } from "lucide-react";

// function Dashboard() {
//     // get user from auth context
//     const { user } = useContext(AuthContext);
//     console.log("user from auth context on dashboard page is : ", user);

//     // state for items
//     const [items, setItems] = useState([]);
//     // state for current folder id
//     const [currentFolderId, setCurrentFolderId] = useState(null); // null = root
//     // state for breadcrumbs navigation
//     const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "Root" }]);
//     // loading state
//     const [loading, setLoading] = useState(false);

//     // fetch items whenever folder id changes
//     useEffect(function () {
//         fetchItems(currentFolderId);
//     }, [currentFolderId]);

//     // function to fetch items from API
//     async function fetchItems(folderId) {
//         try {
//             setLoading(true);
//             const res = await api.get("/items", {
//                 params: { parentId: folderId },
//             });
//             console.log("response of api /items:", res.data);
//             setItems(res.data.data || []);
//         } catch (error) {
//             console.error("Error fetching items: ", error);
//             setItems([]);
//         } finally {
//             setLoading(false);
//         }
//     }

//     // function to enter inside a folder
//     function enterFolder(folder) {
//         setCurrentFolderId(folder.id);
//         setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
//     }

//     // function to navigate with breadcrumbs
//     function goToBreadcrumb(crumb, index) {
//         setCurrentFolderId(crumb.id);
//         setBreadcrumbs(breadcrumbs.slice(0, index + 1));
//     }

//     // rendering UI
//     return (
//         <div className="flex h-screen bg-gray-900 text-gray-100">
//             {/* Sidebar */}
//             <div className="w-64 bg-gray-800 p-4 flex flex-col">
//                 <h2 className="text-xl font-bold mb-6">My Drive</h2>
//                 <ul className="space-y-3 text-gray-300">
//                     <li className="cursor-pointer hover:text-white flex items-center space-x-2">
//                         <Home className="h-5 w-5" />
//                         <span>Home</span>
//                     </li>
//                     <li className="cursor-pointer hover:text-white flex items-center space-x-2">
//                         <Users className="h-5 w-5" />
//                         <span>Shared with me</span>
//                     </li>
//                     <li className="cursor-pointer hover:text-white flex items-center space-x-2">
//                         <Trash2 className="h-5 w-5" />
//                         <span>Trash</span>
//                     </li>
//                 </ul>
//             </div>

//             {/* Main Area */}
//             <div className="flex-1 p-6 overflow-y-auto">
//                 {/* Breadcrumbs */}
//                 <div className="mb-6 text-sm text-gray-400">
//                     {breadcrumbs.map(function (crumb, index) {
//                         return (
//                             <span
//                                 key={crumb.id || "root"}
//                                 onClick={function () {
//                                     goToBreadcrumb(crumb, index);
//                                 }}
//                                 className="cursor-pointer text-blue-400 hover:underline"
//                             >
//                                 {crumb.name}
//                                 {index < breadcrumbs.length - 1 && " / "}
//                             </span>
//                         );
//                     })}
//                 </div>

//                 {/* Content */}
//                 {loading ? (
//                     <div className="flex justify-center items-center h-40">
//                         <Loader2 className="animate-spin h-8 w-8 text-blue-400" />
//                     </div>
//                 ) : items.length === 0 ? (
//                     <p className="text-gray-500">No files or folders here yet.</p>
//                 ) : (
//                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//                         {items.map(function (item) {
//                             return (
//                                 <div
//                                     key={item.id}
//                                     className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow hover:shadow-lg transition cursor-pointer"
//                                     onClick={function () {
//                                         if (item.type === "folder") {
//                                             enterFolder(item);
//                                         }
//                                     }}
//                                 >
//                                     <div className="flex items-center space-x-2">
//                                         {item.type === "folder" ? (
//                                             <Folder className="text-yellow-400 h-5 w-5" />
//                                         ) : (
//                                             <File className="text-blue-400 h-5 w-5" />
//                                         )}
//                                         <p className="truncate">{item.name}</p>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Dashboard;




// // src/pages/Dashboard.jsx

// import { useState, useEffect, useContext } from "react";
// import api from "../utils/axiosInstance";
// import AuthContext from "../context/AuthContext";

// import Sidebar from "../component/Dashboard/Sidebar";
// import DashboardHeader from '../component/Dashboard/DashboardHeader'
// import Breadcrumbs from "../component/Dashboard/Breadcrumbs";
// import FileUpload from "../component/Dashboard/FileUpload";
// import NewItemModal from "../component/Dashboard/NewItemModal";
// import ItemContextMenu from "../component/Dashboard/ItemContextMenu";
// import ItemGrid from "../component/Dashboard/ItemGrid";


// function Dashboard() {
//     const { user } = useContext(AuthContext);
//     console.log("user in dashboar page from auth context is : ",user);

//     // Main states
//     const [items, setItems] = useState([]);
//     const [currentFolderId, setCurrentFolderId] = useState(null); // null = root
//     const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "Root" }]);
//     const [loading, setLoading] = useState(false);
//     const [activeSection, setActiveSection] = useState("my-drive");
//     const [viewMode, setViewMode] = useState("grid");
//     const [searchQuery, setSearchQuery] = useState("");
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // Fetch items whenever folder id or active section changes
//     useEffect(function () {
//         fetchItems();
//     }, [currentFolderId, activeSection]);

//     async function fetchItems() {
//         try {
//             setLoading(true);
//             const params = { parentId: currentFolderId, section: activeSection, search: searchQuery };
//             const res = await api.get("/items", { params });
//             console.log("res of getting all items on dashboard page is : ",res);
//             setItems(res.data.data || []);
//         } catch (error) {
//             console.error("Error fetching items:", error);
//             setItems([]);
//         } finally {
//             setLoading(false);
//         }
//     }

//     function handleSectionChange(sectionId) {
//         setActiveSection(sectionId);
//         setCurrentFolderId(null);
//         setBreadcrumbs([{ id: null, name: "Root" }]);
//     }

//     function handleNavigate(folderId) {
//         if (folderId === null) {
//             setCurrentFolderId(null);
//             setBreadcrumbs([{ id: null, name: "Root" }]);
//         } else {
//             const index = breadcrumbs.findIndex(b => b.id === folderId);
//             setBreadcrumbs(breadcrumbs.slice(0, index + 1));
//             setCurrentFolderId(folderId);
//         }
//     }

//     function handleItemClick(item) {
//         if (item.type === "folder") {
//             setCurrentFolderId(item.id);
//             setBreadcrumbs([...breadcrumbs, { id: item.id, name: item.name }]);
//         }
//     }

//     function handleItemAction(action, item) {
//         console.log("Action:", action, "on item:", item);
//         // Here we can handle download, delete, star, rename, share
//     }

//     function handleNewItemCreated() {
//         fetchItems();
//     }

//     return (
//         <div className="flex h-screen bg-gray-900 text-gray-100">
//             {/* Sidebar */}
//             <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

//             {/* Main content */}
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <DashboardHeader
//                     searchQuery={searchQuery}
//                     onSearchChange={setSearchQuery}
//                     viewMode={viewMode}
//                     onViewModeToggle={setViewMode}
//                     onNewClick={function () { setIsModalOpen(true); }}
//                 />

//                 <div className="p-6 overflow-y-auto flex-1">
//                     {/* Breadcrumbs */}
//                     <Breadcrumbs path={breadcrumbs} onNavigate={handleNavigate} />

//                     {/* File Upload Wrapper */}
//                     <FileUpload parentId={currentFolderId} onUploadComplete={fetchItems}>
//                         {/* You can wrap a button to trigger file upload */}
//                         <button className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition">
//                             Upload Files
//                         </button>
//                     </FileUpload>

//                     {/* Item Grid */}
//                     {loading ? (
//                         <div className="flex justify-center items-center h-40 text-gray-400">Loading...</div>
//                     ) : items.length === 0 ? (
//                         <p className="text-gray-500">No files or folders here.</p>
//                     ) : (
//                         <ItemGrid
//                             items={items}
//                             viewMode={viewMode}
//                             onItemClick={handleItemClick}
//                             onItemAction={handleItemAction}
//                         />
//                     )}
//                 </div>
//             </div>

//             {/* New Item Modal */}
//             <NewItemModal
//                 isOpen={isModalOpen}
//                 onClose={function () { setIsModalOpen(false); }}
//                 parentId={currentFolderId}
//                 onItemCreated={handleNewItemCreated}
//             />
//         </div>
//     );
// }

// export default Dashboard;




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

function Dashboard() {
    const navigate=useNavigate();
    const { user } = useContext(AuthContext);
    console.log("user on dashboard page from auth is : ",user);

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

            } else if (activeSection === "shared-with-me") {
                //shared route
                res = await api.get("/shares/shared-with-me");
                console.log("response of shared with me api is : ",res);

            } else if (activeSection === "trash") {
                // trash route
                res = await api.get("/trash");
                console.log("response of trash api is : ",res);

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
                    console.log("res of debounced search api is : ",res);
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
    function handleItemClick(item) {
        if (item.type === "folder") {
            setCurrentFolderId(item.id);
            setBreadcrumbs([...breadcrumbs, { id: item.id, name: item.name }]);
        } else {
            // open preview for files
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
            // ❗ Add these routes in backend OR change below to your actual move endpoints:
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
            // ❗ Backend missing. Example expected:
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

                    <FileUpload parentId={currentFolderId} onUploadComplete={fetchItems}>
                        <button className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition">
                            Upload Files
                        </button>
                    </FileUpload>

                    {loading ? (
                        <div className="flex justify-center items-center h-40 text-gray-400">
                            Loading...
                        </div>
                    ) : items.length === 0 ? (
                        <p className="text-gray-500">No files or folders here.</p>
                    ) : (
                        <ItemGrid
                            items={items}
                            viewMode={viewMode}
                            onItemClick={handleItemClick}
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
        </div>
    );
}

export default Dashboard;


