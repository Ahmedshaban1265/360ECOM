// src/context/ContentContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
    const [pages, setPages] = useState({});
    const [draftPages, setDraftPages] = useState({});
    const [editMode, setEditMode] = useState(false);

    // ✅ الصفحة الحالية
    const [currentPage, setCurrentPage] = useState("home");

    // تحميل البيانات من localStorage أو تعيين بيانات افتراضية
    useEffect(() => {
        const savedPages = localStorage.getItem("siteContent");
        if (savedPages) {
            setPages(JSON.parse(savedPages));
        } else {
            setPages({
                home: {
                    sections: [
                        {
                            id: "hero1",
                            type: "hero",
                            settings: { title: "Welcome to My Store", image: "/hero.jpg" }
                        },
                        {
                            id: "about1",
                            type: "text",
                            settings: { content: "This is the about section." }
                        }
                    ]
                },
                about: {
                    sections: [
                        {
                            id: "about2",
                            type: "text",
                            settings: { content: "About page content here..." }
                        }
                    ]
                }
            });
        }
    }, []);

    // حفظ التغييرات في localStorage
    useEffect(() => {
        if (Object.keys(pages).length > 0) {
            localStorage.setItem("siteContent", JSON.stringify(pages));
        }
    }, [pages]);

    // بدء التعديل على صفحة
    const startEditing = (pageId) => {
        setEditMode(true);
        setDraftPages((prev) => ({
            ...prev,
            [pageId]: JSON.parse(JSON.stringify(pages[pageId] || { sections: [] }))
        }));
    };

    // تحديث قسم واحد داخل الـ draft
    const updateDraftSection = (pageId, sectionId, newSettings) => {
        setDraftPages((prev) => ({
            ...prev,
            [pageId]: {
                ...prev[pageId],
                sections: prev[pageId].sections.map((sec) =>
                    sec.id === sectionId
                        ? { ...sec, settings: { ...sec.settings, ...newSettings } }
                        : sec
                )
            }
        }));
    };

    // تحديث الصفحة كاملة (مهم لـ PuckEditor)
    const updateDraftPage = (pageId, newPageData) => {
        setDraftPages((prev) => ({
            ...prev,
            [pageId]: newPageData
        }));
    };

    // إضافة قسم جديد للـ draft
    const addDraftSection = (pageId, newSection) => {
        setDraftPages((prev) => ({
            ...prev,
            [pageId]: {
                ...prev[pageId],
                sections: [...prev[pageId].sections, newSection]
            }
        }));
    };

    // حذف قسم من الـ draft
    const deleteDraftSection = (pageId, sectionId) => {
        setDraftPages((prev) => ({
            ...prev,
            [pageId]: {
                ...prev[pageId],
                sections: prev[pageId].sections.filter(
                    (sec) => sec.id !== sectionId
                )
            }
        }));
    };

    // نشر الصفحة (حفظ الـ draft في النسخة النهائية)
    const publishPage = (pageId) => {
        setPages((prev) => ({
            ...prev,
            [pageId]: draftPages[pageId]
        }));
        setEditMode(false);
    };

    // تجاهل التعديلات
    const discardChanges = (pageId) => {
        setDraftPages((prev) => {
            const newDrafts = { ...prev };
            delete newDrafts[pageId];
            return newDrafts;
        });
        setEditMode(false);
    };

    // إعادة تعيين الموقع بالكامل
    const resetSite = () => {
        localStorage.removeItem("siteContent");
        window.location.reload();
    };

    return (
        <ContentContext.Provider
            value={{
                pages,
                draftPages,
                editMode,
                setEditMode,
                currentPage,       // ✅ أضفناها
                setCurrentPage,    // ✅ أضفناها
                startEditing,
                updateDraftSection,
                updateDraftPage,
                addDraftSection,
                deleteDraftSection,
                publishPage,
                discardChanges,
                resetSite
            }}
        >
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => useContext(ContentContext);
