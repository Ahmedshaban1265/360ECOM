import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEditorStore } from '../store/editorStore';
import { initializeDefaultTemplates } from '../defaults/templates';

// Layout Components
import EditorToolbar from '../components/EditorToolbar';
import LeftNavTemplates from '../components/LeftNavTemplates';
import SectionsTree from '../components/SectionsTree';
import PropertiesPanel from '../components/PropertiesPanel';
import PreviewCanvas from '../components/PreviewCanvas';

// UI Components
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Loader2 } from 'lucide-react';

export default function AdminEditor() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { selectedTemplate, loadTemplate } = useEditorStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  // Authentication guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin-login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Initialize editor
  useEffect(() => {
    async function initializeEditor() {
      try {
        setIsInitializing(true);
        setInitError(null);
        
        // Initialize default templates if they don't exist
        await initializeDefaultTemplates();
        
        // Load home template by default if no template is selected
        if (!selectedTemplate) {
          await loadTemplate('home');
        }
        
        setIsInitializing(false);
      } catch (error) {
        console.error('Failed to initialize editor:', error);
        setInitError('Failed to initialize the theme editor. Please try refreshing the page.');
        setIsInitializing(false);
      }
    }

    if (isAuthenticated) {
      initializeEditor();
    }
  }, [isAuthenticated, selectedTemplate]);

  // Show loading state
  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            {isLoading ? 'Checking authentication...' : 'Initializing theme editor...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (initError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-destructive text-lg font-semibold">Initialization Error</div>
          <p className="text-muted-foreground">{initError}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <EditorToolbar />
      </div>

      {/* Main Editor Layout */}
      <div className="h-[calc(100vh-3.5rem)]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Templates */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full border-r border-border bg-background">
              <LeftNavTemplates />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Center Panel - Sections Tree */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full border-r border-border bg-background">
              <SectionsTree />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Main Content - Preview Canvas */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full bg-muted/20">
              <PreviewCanvas />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Properties */}
          <ResizablePanel defaultSize={15} minSize={15} maxSize={25}>
            <div className="h-full border-l border-border bg-background">
              <PropertiesPanel />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
