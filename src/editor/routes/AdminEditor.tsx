import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEditorStore } from '../store/editorStore';
import { initializeDefaultTemplates } from '../defaults/templates';

// UI Components
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
      if (hasInitialized.current) return;

      try {
        setIsInitializing(true);
        setInitError(null);
        hasInitialized.current = true;

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
        hasInitialized.current = false; // Reset on error to allow retry
      }
    }

    if (isAuthenticated && !hasInitialized.current) {
      initializeEditor();
    }
  }, [isAuthenticated]);

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
      {/* Simple debug view to isolate the issue */}
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Theme Editor Debug</h1>
        <div className="space-y-4">
          <p>Selected Template: {selectedTemplate || 'None'}</p>
          <p>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>Is Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Is Initializing: {isInitializing ? 'Yes' : 'No'}</p>
          {initError && (
            <div className="p-4 bg-red-100 border border-red-400 rounded">
              <p className="text-red-700">Error: {initError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
