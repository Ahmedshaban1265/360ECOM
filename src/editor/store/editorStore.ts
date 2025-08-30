import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { EditorState, TemplateDocument, SectionInstance, BlockInstance, DeviceType, Locale, HistoryEntry } from '../types';
import { storageService } from '../services/StorageService';
import { DEFAULT_THEME_TOKENS } from '../defaults/templates';

export type SidebarTab = 'sections' | 'properties' | 'templates' | 'pages';

interface EditorActions {
  // Template operations
  setSelectedTemplate: (templateId: string) => void;
  loadTemplate: (templateId: string) => Promise<void>;
  saveTemplate: () => Promise<void>;
  publishTemplate: () => Promise<void>;
  resetToPublished: () => Promise<void>;

  // Selection
  setSelectedSection: (sectionId: string | null) => void;
  setSelectedBlock: (blockId: string | null) => void;
  setSelectedElement: (element: HTMLElement | null) => void;
  clearSelection: () => void;

  // Sidebar
  setSidebarOpen: (isOpen: boolean) => void;
  setSidebarTab: (tab: SidebarTab | null) => void;
  toggleSidebar: () => void;
  openSidebarTab: (tab: SidebarTab) => void;
  
  // Device and appearance
  setDeviceType: (device: DeviceType) => void;
  setDarkMode: (isDark: boolean) => void;
  setRTL: (isRTL: boolean) => void;
  setLocale: (locale: Locale) => void;
  
  // Section operations
  addSection: (sectionType: string, afterSectionId?: string) => void;
  removeSection: (sectionId: string) => void;
  duplicateSection: (sectionId: string) => void;
  moveSectionUp: (sectionId: string) => void;
  moveSectionDown: (sectionId: string) => void;
  reorderSections: (sectionIds: string[]) => void;
  updateSectionSettings: (sectionId: string, settings: Record<string, any>) => void;
  
  // Block operations
  addBlock: (sectionId: string, blockType: string, afterBlockId?: string) => void;
  removeBlock: (sectionId: string, blockId: string) => void;
  duplicateBlock: (sectionId: string, blockId: string) => void;
  moveBlockUp: (sectionId: string, blockId: string) => void;
  moveBlockDown: (sectionId: string, blockId: string) => void;
  reorderBlocks: (sectionId: string, blockIds: string[]) => void;
  updateBlockSettings: (sectionId: string, blockId: string, settings: Record<string, any>) => void;
  
  // History (undo/redo)
  undo: () => void;
  redo: () => void;
  addToHistory: (action: string) => void;
  clearHistory: () => void;
  
  // Global theme settings
  updateThemeTokens: (tokens: Partial<typeof DEFAULT_THEME_TOKENS>) => void;
  
  // Import/Export
  exportTemplate: () => Promise<string>;
  importTemplate: (data: string) => Promise<void>;
  
  // Utility
  markDirty: () => void;
  markClean: () => void;
  getCurrentTemplate: () => TemplateDocument | null;

  // Auto-save functionality
  enableAutoSave: (interval?: number) => void;
  disableAutoSave: () => void;
}

interface EditorStore extends EditorState, EditorActions {}

const MAX_HISTORY = 50;
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

let autoSaveInterval: NodeJS.Timeout | null = null;

export const useEditorStore = create<EditorStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      selectedTemplate: null,
      selectedSection: null,
      selectedBlock: null,
      selectedElement: null,
      deviceType: 'desktop',
      isDarkMode: true,
      isRTL: false,
      locale: 'en',
      historyIndex: -1,
      history: [],
      isDirty: false,
      lastSaved: undefined,
      currentTemplate: null,

      // Sidebar state
      isSidebarOpen: true,
      activeTab: 'sections' as SidebarTab,

      // Template operations
      setSelectedTemplate: (templateId: string) => {
        set({ selectedTemplate: templateId, selectedSection: null, selectedBlock: null });
      },

      loadTemplate: async (templateId: string) => {
        try {
          const template = await storageService.getDraft(templateId);
          if (template) {
            // Initialize history with the loaded template
            const initialHistoryEntry = {
              template: JSON.parse(JSON.stringify(template)),
              action: 'Load template',
              timestamp: Date.now()
            };

            set({
              selectedTemplate: templateId,
              currentTemplate: template,
              selectedSection: null,
              selectedBlock: null,
              isDirty: false,
              locale: template.locale,
              isRTL: template.themeTokens.rtl || false,
              isDarkMode: template.themeTokens.darkMode !== undefined ? template.themeTokens.darkMode : true,
              history: [initialHistoryEntry],
              historyIndex: 0
            });
          }
        } catch (error) {
          console.error('Failed to load template:', error);
        }
      },

      saveTemplate: async () => {
        const { selectedTemplate, currentTemplate } = get();
        if (!selectedTemplate || !currentTemplate) return;

        try {
          await storageService.saveDraft(selectedTemplate, currentTemplate);
          set({ isDirty: false, lastSaved: new Date().toISOString() });
          console.log('Template saved successfully');
        } catch (error) {
          console.error('Failed to save template:', error);
          throw new Error('Failed to save template. Please try again.');
        }
      },

      publishTemplate: async () => {
        const { selectedTemplate, currentTemplate } = get();
        if (!selectedTemplate || !currentTemplate) return;

        try {
          await storageService.publish(selectedTemplate, currentTemplate);
          set({ isDirty: false, lastSaved: new Date().toISOString() });
          console.log('Template published successfully');
        } catch (error) {
          console.error('Failed to publish template:', error);
          throw new Error('Failed to publish template. Please try again.');
        }
      },

      resetToPublished: async () => {
        const { selectedTemplate } = get();
        if (!selectedTemplate) return;

        try {
          const published = await storageService.getPublished(selectedTemplate);
          if (published) {
            set({ 
              currentTemplate: published,
              isDirty: false,
              selectedSection: null,
              selectedBlock: null
            });
            get().clearHistory();
            get().addToHistory('Reset to published');
          }
        } catch (error) {
          console.error('Failed to reset to published:', error);
        }
      },

      // Selection
      setSelectedSection: (sectionId: string | null) => {
        set({ selectedSection: sectionId, selectedBlock: null });
      },

      setSelectedBlock: (blockId: string | null) => {
        set({ selectedBlock: blockId });
      },

      setSelectedElement: (element: HTMLElement | null) => {
        set({ selectedElement: element });
      },

      clearSelection: () => {
        set({ selectedSection: null, selectedBlock: null, selectedElement: null });
      },

      // Sidebar
      setSidebarOpen: (isOpen: boolean) => {
        set({ isSidebarOpen: isOpen });
      },

      setSidebarTab: (tab: SidebarTab | null) => {
        set({
          activeTab: tab,
          isSidebarOpen: tab !== null
        });
      },

      toggleSidebar: () => {
        const { isSidebarOpen } = get();
        set({ isSidebarOpen: !isSidebarOpen });
      },

      openSidebarTab: (tab: SidebarTab) => {
        set({
          activeTab: tab,
          isSidebarOpen: true
        });
      },

      // Device and appearance
      setDeviceType: (device: DeviceType) => {
        set({ deviceType: device });
      },

      // Interaction/preview controls removed for initial state

      setDarkMode: (isDark: boolean) => {
        const { currentTemplate } = get();
        if (currentTemplate) {
          const updatedTemplate = {
            ...currentTemplate,
            themeTokens: {
              ...currentTemplate.themeTokens,
              darkMode: isDark
            }
          };
          set({ currentTemplate: updatedTemplate, isDarkMode: isDark });
          get().markDirty();
        }
      },

      setRTL: (isRTL: boolean) => {
        const { currentTemplate } = get();
        if (currentTemplate) {
          const updatedTemplate = {
            ...currentTemplate,
            themeTokens: {
              ...currentTemplate.themeTokens,
              rtl: isRTL
            }
          };
          set({ currentTemplate: updatedTemplate, isRTL });
          get().markDirty();
        }
      },

      setLocale: (locale: Locale) => {
        const { currentTemplate } = get();
        if (currentTemplate) {
          const updatedTemplate = {
            ...currentTemplate,
            locale
          };
          set({ currentTemplate: updatedTemplate, locale });
          get().markDirty();
        }
      },

      // Section operations
      addSection: (sectionType: string, afterSectionId?: string) => {
        const { currentTemplate } = get();
        if (!currentTemplate) return;

        const newSection: SectionInstance = {
          id: `${sectionType}-${Date.now()}`,
          type: sectionType,
          settings: {},
          blocks: []
        };

        const sections = [...currentTemplate.sections];
        if (afterSectionId) {
          const index = sections.findIndex(s => s.id === afterSectionId);
          sections.splice(index + 1, 0, newSection);
        } else {
          sections.push(newSection);
        }

        const updatedTemplate = { ...currentTemplate, sections };
        set({ currentTemplate: updatedTemplate, selectedSection: newSection.id });
        get().markDirty();
        get().addToHistory(`Add ${sectionType} section`);
      },

      removeSection: (sectionId: string) => {
        const { currentTemplate, selectedSection } = get();
        if (!currentTemplate) return;

        const sections = currentTemplate.sections.filter(s => s.id !== sectionId);
        const updatedTemplate = { ...currentTemplate, sections };
        
        set({ 
          currentTemplate: updatedTemplate,
          selectedSection: selectedSection === sectionId ? null : selectedSection,
          selectedBlock: null
        });
        get().markDirty();
        get().addToHistory('Remove section');
      },

      duplicateSection: (sectionId: string) => {
        const { currentTemplate } = get();
        if (!currentTemplate) return;

        const section = currentTemplate.sections.find(s => s.id === sectionId);
        if (!section) return;

        const duplicated: SectionInstance = {
          ...section,
          id: `${section.type}-${Date.now()}`,
          blocks: section.blocks?.map(block => ({
            ...block,
            id: `${block.type}-${Date.now()}`
          })) || []
        };

        const sections = [...currentTemplate.sections];
        const index = sections.findIndex(s => s.id === sectionId);
        sections.splice(index + 1, 0, duplicated);

        const updatedTemplate = { ...currentTemplate, sections };
        set({ currentTemplate: updatedTemplate, selectedSection: duplicated.id });
        get().markDirty();
        get().addToHistory('Duplicate section');
      },

      moveSectionUp: (sectionId: string) => {
        const { currentTemplate } = get();
        if (!currentTemplate) return;

        const sections = [...currentTemplate.sections];
        const index = sections.findIndex(s => s.id === sectionId);
        if (index > 0) {
          [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
          const updatedTemplate = { ...currentTemplate, sections };
          set({ currentTemplate: updatedTemplate });
          get().markDirty();
          get().addToHistory('Move section up');
        }
      },

      moveSectionDown: (sectionId: string) => {
        const { currentTemplate } = get();
        if (!currentTemplate) return;

        const sections = [...currentTemplate.sections];
        const index = sections.findIndex(s => s.id === sectionId);
        if (index < sections.length - 1) {
          [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
          const updatedTemplate = { ...currentTemplate, sections };
          set({ currentTemplate: updatedTemplate });
          get().markDirty();
          get().addToHistory('Move section down');
        }
      },

      reorderSections: (sectionIds: string[]) => {
        const { currentTemplate } = get();
        if (!currentTemplate) return;

        const sectionMap = new Map(currentTemplate.sections.map(s => [s.id, s]));
        const sections = sectionIds.map(id => sectionMap.get(id)).filter(Boolean) as SectionInstance[];
        
        const updatedTemplate = { ...currentTemplate, sections };
        set({ currentTemplate: updatedTemplate });
        get().markDirty();
        get().addToHistory('Reorder sections');
      },

      updateSectionSettings: (sectionId: string, settings: Record<string, any>) => {
        const { currentTemplate } = get();
        if (!currentTemplate) return;

        const sections = currentTemplate.sections.map(section =>
          section.id === sectionId
            ? { ...section, settings: { ...section.settings, ...settings } }
            : section
        );

        const updatedTemplate = { ...currentTemplate, sections };
        set({ currentTemplate: updatedTemplate });
        get().markDirty();
      },

      // Block operations
      addBlock: (sectionId: string, blockType: string, afterBlockId?: string) => {
        const { currentTemplate } = get();
        if (!currentTemplate) return;

        const newBlock: BlockInstance = {
          id: `${blockType}-${Date.now()}`,
          type: blockType,
          settings: {}
        };

        const sections = currentTemplate.sections.map(section => {
          if (section.id === sectionId) {
            const blocks = [...(section.blocks || [])];
            if (afterBlockId) {
              const index = blocks.findIndex(b => b.id === afterBlockId);
              blocks.splice(index + 1, 0, newBlock);
            } else {
              blocks.push(newBlock);
            }
            return { ...section, blocks };
          }
          return section;
        });

        const updatedTemplate = { ...currentTemplate, sections };
        set({ currentTemplate: updatedTemplate, selectedBlock: newBlock.id });
        get().markDirty();
        get().addToHistory(`Add ${blockType} block`);
      },

      removeBlock: (sectionId: string, blockId: string) => {
        const { currentTemplate, selectedBlock } = get();
        if (!currentTemplate) return;

        const sections = currentTemplate.sections.map(section => {
          if (section.id === sectionId) {
            const blocks = (section.blocks || []).filter(b => b.id !== blockId);
            return { ...section, blocks };
          }
          return section;
        });

        const updatedTemplate = { ...currentTemplate, sections };
        set({ 
          currentTemplate: updatedTemplate,
          selectedBlock: selectedBlock === blockId ? null : selectedBlock
        });
        get().markDirty();
        get().addToHistory('Remove block');
      },

      duplicateBlock: (sectionId: string, blockId: string) => {
        const { currentTemplate } = get();
        if (!currentTemplate) return;

        const sections = currentTemplate.sections.map(section => {
          if (section.id === sectionId) {
            const block = section.blocks?.find(b => b.id === blockId);
            if (!block) return section;

            const duplicated: BlockInstance = {
              ...block,
              id: `${block.type}-${Date.now()}`
            };

            const blocks = [...(section.blocks || [])];
            const index = blocks.findIndex(b => b.id === blockId);
            blocks.splice(index + 1, 0, duplicated);

            return { ...section, blocks };
          }
          return section;
        });

        const updatedTemplate = { ...currentTemplate, sections };
        set({ currentTemplate: updatedTemplate });
        get().markDirty();
        get().addToHistory('Duplicate block');
      },

      moveBlockUp: (sectionId: string, blockId: string) => {
        const { currentTemplate } = get();
        if (!currentTemplate) return;

        const sections = currentTemplate.sections.map(section => {
          if (section.id === sectionId && section.blocks) {
            const blocks = [...section.blocks];
            const index = blocks.findIndex(b => b.id === blockId);
            if (index > 0) {
              [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
              return { ...section, blocks };
            }
          }
          return section;
        });

        const updatedTemplate = { ...currentTemplate, sections };
        set({ currentTemplate: updatedTemplate });
        get().markDirty();
        get().addToHistory('Move block up');
      },

      moveBlockDown: (sectionId: string, blockId: string) => {
        const { currentTemplate } = get();
        if (!currentTemplate) return;

        const sections = currentTemplate.sections.map(section => {
          if (section.id === sectionId && section.blocks) {
            const blocks = [...section.blocks];
            const index = blocks.findIndex(b => b.id === blockId);
            if (index < blocks.length - 1) {
              [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
              return { ...section, blocks };
            }
          }
          return section;
        });

        const updatedTemplate = { ...currentTemplate, sections };
        set({ currentTemplate: updatedTemplate });
        get().markDirty();
        get().addToHistory('Move block down');
      },

      reorderBlocks: (sectionId: string, blockIds: string[]) => {
        const { currentTemplate } = get();
        if (!currentTemplate) return;

        const sections = currentTemplate.sections.map(section => {
          if (section.id === sectionId && section.blocks) {
            const blockMap = new Map(section.blocks.map(b => [b.id, b]));
            const blocks = blockIds.map(id => blockMap.get(id)).filter(Boolean) as BlockInstance[];
            return { ...section, blocks };
          }
          return section;
        });

        const updatedTemplate = { ...currentTemplate, sections };
        set({ currentTemplate: updatedTemplate });
        get().markDirty();
        get().addToHistory('Reorder blocks');
      },

      updateBlockSettings: (sectionId: string, blockId: string, settings: Record<string, any>) => {
        const { currentTemplate } = get();
        if (!currentTemplate) return;

        const sections = currentTemplate.sections.map(section => {
          if (section.id === sectionId && section.blocks) {
            const blocks = section.blocks.map(block =>
              block.id === blockId
                ? { ...block, settings: { ...block.settings, ...settings } }
                : block
            );
            return { ...section, blocks };
          }
          return section;
        });

        const updatedTemplate = { ...currentTemplate, sections };
        set({ currentTemplate: updatedTemplate });
        get().markDirty();
      },

      // History (undo/redo)
      undo: () => {
        const { history, historyIndex, currentTemplate } = get();
        if (historyIndex > 0) {
          const previousEntry = history[historyIndex - 1];
          set({ 
            currentTemplate: previousEntry.template,
            historyIndex: historyIndex - 1,
            selectedSection: null,
            selectedBlock: null
          });
          get().markDirty();
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const nextEntry = history[historyIndex + 1];
          set({ 
            currentTemplate: nextEntry.template,
            historyIndex: historyIndex + 1,
            selectedSection: null,
            selectedBlock: null
          });
          get().markDirty();
        }
      },

      addToHistory: (action: string) => {
        const { currentTemplate, history, historyIndex } = get();
        if (!currentTemplate) return;

        const newEntry: HistoryEntry = {
          template: JSON.parse(JSON.stringify(currentTemplate)), // Deep clone
          action,
          timestamp: Date.now()
        };

        // Remove any entries after current index (when user made changes after undo)
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newEntry);

        // Limit history size
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }

        set({ 
          history: newHistory,
          historyIndex: newHistory.length - 1
        });
      },

      clearHistory: () => {
        set({ history: [], historyIndex: -1 });
      },

      // Global theme settings
      updateThemeTokens: (tokens: Partial<typeof DEFAULT_THEME_TOKENS>) => {
        const { currentTemplate } = get();
        if (!currentTemplate) return;

        const updatedTemplate = {
          ...currentTemplate,
          themeTokens: {
            ...currentTemplate.themeTokens,
            ...tokens
          }
        };

        set({ currentTemplate: updatedTemplate });
        get().markDirty();
        get().addToHistory('Update theme settings');
      },

      // Import/Export
      exportTemplate: async () => {
        const { selectedTemplate } = get();
        if (!selectedTemplate) throw new Error('No template selected');
        
        return storageService.exportTemplate(selectedTemplate);
      },

      importTemplate: async (data: string) => {
        try {
          const template = await storageService.importTemplate(data);
          await get().loadTemplate(template.id);
          get().addToHistory('Import template');
        } catch (error) {
          console.error('Failed to import template:', error);
          throw error;
        }
      },

      // Utility
      markDirty: () => {
        set({ isDirty: true });
        // Auto-enable auto-save when content becomes dirty
        if (!autoSaveInterval) {
          get().enableAutoSave();
        }
      },

      markClean: () => {
        set({ isDirty: false });
      },

      getCurrentTemplate: () => {
        return get().currentTemplate;
      },

      // Auto-save functionality
      enableAutoSave: (interval = AUTO_SAVE_INTERVAL) => {
        if (autoSaveInterval) {
          clearInterval(autoSaveInterval);
        }

        autoSaveInterval = setInterval(async () => {
          const { isDirty, selectedTemplate, currentTemplate } = get();
          if (isDirty && selectedTemplate && currentTemplate) {
            try {
              await get().saveTemplate();
              console.log('Auto-saved template');
            } catch (error) {
              console.warn('Auto-save failed:', error);
            }
          }
        }, interval);
      },

      disableAutoSave: () => {
        if (autoSaveInterval) {
          clearInterval(autoSaveInterval);
          autoSaveInterval = null;
        }
      }
    }),
    {
      name: 'theme-editor-store'
    }
  )
);

// Selector hooks for performance
export const useSelectedTemplate = () => useEditorStore(state => state.selectedTemplate);
export const useSelectedSection = () => useEditorStore(state => state.selectedSection);
export const useSelectedBlock = () => useEditorStore(state => state.selectedBlock);
export const useCurrentTemplate = () => useEditorStore(state => state.currentTemplate);
export const useDeviceType = () => useEditorStore(state => state.deviceType);
export const useIsDirty = () => useEditorStore(state => state.isDirty);
export const useHistoryState = () => useEditorStore(state => ({ 
  canUndo: state.historyIndex > 0,
  canRedo: state.historyIndex < state.history.length - 1
}));
export const useInteractionMode = () => useEditorStore(state => state.interactionMode);
export const usePreviewDarkMode = () => useEditorStore(state => state.previewDarkMode);
