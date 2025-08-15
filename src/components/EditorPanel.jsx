// // src/components/EditorPanel.jsx
// import { useState } from "react";
// import { useContent } from "@/context/ContentContext";
// import { Plus, Trash2, Edit } from "lucide-react";

// export default function EditorPanel({ currentPage, setCurrentPage }) {
//     const {
//         pages,
//         draftPages,
//         editMode,
//         updateDraftSection,
//         addDraftSection,
//         deleteDraftSection,
//         publishPage,
//         discardChanges
//     } = useContent();

//     const activePage = draftPages[currentPage] || pages[currentPage] || { sections: [] };
//     const [newSectionType, setNewSectionType] = useState("");

//     const handleAddSection = () => {
//         if (!newSectionType) return;
//         const newSection = {
//             id: Date.now().toString(),
//             type: newSectionType,
//             settings: newSectionType === "hero"
//                 ? { title: "New Hero Section", image: "/placeholder.jpg" }
//                 : { content: "New content..." }
//         };
//         addDraftSection(currentPage, newSection);
//         setNewSectionType("");
//     };

//     return (
//         <div className="fixed top-0 right-0 w-96 h-full bg-black shadow-lg p-4 border-l border-gray-200 z-50 overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">Editor Panel</h2>

//             <label className="block text-sm font-medium mb-2">Select Page</label>
//             <select
//                 value={currentPage}
//                 onChange={(e) => setCurrentPage(e.target.value)}
//                 className="w-full border rounded p-2 mb-4"
//             >
//                 {Object.keys(pages).map((pageId) => (
//                     <option key={pageId} value={pageId}>
//                         {pageId}
//                     </option>
//                 ))}
//             </select>

//             <div className="space-y-3">
//                 {activePage.sections.map((section) => (
//                     <div
//                         key={section.id}
//                         className="border p-3 rounded flex justify-between items-center"
//                     >
//                         <div>
//                             <div className="font-semibold">{section.type}</div>
//                             <div className="text-sm text-gray-600 truncate max-w-[120px]">
//                                 {section.settings.title || section.settings.content}
//                             </div>
//                         </div>
//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() =>
//                                     updateDraftSection(currentPage, section.id, {
//                                         title: prompt("New title/content", section.settings.title || section.settings.content)
//                                     })
//                                 }
//                                 className="text-blue-500 hover:text-blue-700"
//                             >
//                                 <Edit size={18} />
//                             </button>
//                             <button
//                                 onClick={() => deleteDraftSection(currentPage, section.id)}
//                                 className="text-red-500 hover:text-red-700"
//                             >
//                                 <Trash2 size={18} />
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             <div className="mt-6 border-t pt-4">
//                 <label className="block text-sm font-medium mb-2">Add Section</label>
//                 <select
//                     value={newSectionType}
//                     onChange={(e) => setNewSectionType(e.target.value)}
//                     className="w-full border rounded p-2 mb-2"
//                 >
//                     <option value="">Select Type</option>
//                     <option value="hero">Hero Section</option>
//                     <option value="text">Text Block</option>
//                     <option value="image">Image Block</option>
//                 </select>
//                 <button
//                     onClick={handleAddSection}
//                     className="w-full bg-green-500 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-green-600"
//                 >
//                     <Plus size={18} /> Add Section
//                 </button>
//             </div>

//             <div className="mt-6 flex gap-2">
//                 <button
//                     onClick={() => publishPage(currentPage)}
//                     className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//                 >
//                     Publish
//                 </button>
//                 <button
//                     onClick={() => discardChanges(currentPage)}
//                     className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
//                 >
//                     Discard
//                 </button>
//             </div>
//         </div>
//     );
// }
