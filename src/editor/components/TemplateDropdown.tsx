import { useState, useEffect } from 'react';
import { useEditorStore, useSelectedTemplate } from '../store/editorStore';
import { getRealPagesList } from '../utils/pageExtractor';
import { storageService } from '../services/StorageService';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

// Icons
import { 
  ChevronDown, 
  FileText, 
  Eye, 
  Clock,
  AlertCircle,
  Plus
} from 'lucide-react';

interface TemplateStatus {
  id: string;
  hasDraft: boolean;
  hasPublished: boolean;
  hasUnsavedChanges: boolean;
  lastDraftUpdate?: string;
  lastPublishedUpdate?: string;
}

export default function TemplateDropdown() {
  const selectedTemplate = useSelectedTemplate();
  const { loadTemplate } = useEditorStore();
  const [templateStatuses, setTemplateStatuses] = useState<Record<string, TemplateStatus>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const realPages = getRealPagesList();

  // Load template statuses when dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadStatuses();
    }
  }, [isOpen]);

  const loadStatuses = async () => {
    setIsLoading(true);
    const statuses: Record<string, TemplateStatus> = {};

    for (const page of realPages) {
      try {
        const status = await storageService.getTemplateStatus(page.id);
        statuses[page.id] = {
          id: page.id,
          ...status
        };
      } catch (error) {
        console.error(`Failed to load status for template ${page.id}:`, error);
        statuses[page.id] = {
          id: page.id,
          hasDraft: false,
          hasPublished: false,
          hasUnsavedChanges: false
        };
      }
    }

    setTemplateStatuses(statuses);
    setIsLoading(false);
  };

  const handleTemplateSelect = async (templateId: string) => {
    try {
      await loadTemplate(templateId);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to load template:', error);
    }
  };

  const getStatusBadge = (status: TemplateStatus) => {
    if (!status.hasDraft && !status.hasPublished) {
      return (
        <Badge variant="outline" className="text-xs ml-auto">
          New
        </Badge>
      );
    }

    if (status.hasUnsavedChanges) {
      return (
        <Badge variant="secondary" className="text-xs ml-auto">
          <AlertCircle className="w-3 h-3 mr-1" />
          Modified
        </Badge>
      );
    }

    if (status.hasPublished) {
      return (
        <Badge variant="default" className="text-xs ml-auto">
          <Eye className="w-3 h-3 mr-1" />
          Live
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="text-xs ml-auto">
        Draft
      </Badge>
    );
  };

  const formatLastUpdate = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getCurrentPageInfo = () => {
    if (!selectedTemplate) return null;
    return realPages.find(page => page.id === selectedTemplate);
  };

  const currentPage = getCurrentPageInfo();

  return (
    <TooltipProvider>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 max-w-[200px]">
                <span className="text-lg">{currentPage?.icon || '📄'}</span>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-sm font-medium truncate">
                    {currentPage?.name || 'Select Template'}
                  </span>
                  {currentPage?.route && (
                    <span className="text-xs text-muted-foreground truncate">
                      {currentPage.route}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Select a page template to edit</TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="start" className="w-80">
          <div className="p-2">
            <div className="text-sm font-medium mb-2">Select Page Template</div>
            <div className="text-xs text-muted-foreground mb-3">
              Choose a page to edit with the theme editor
            </div>
          </div>
          
          <DropdownMenuSeparator />

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Loading templates...</div>
              </div>
            ) : (
              realPages.map((page) => {
                const status = templateStatuses[page.id];
                const isSelected = selectedTemplate === page.id;

                return (
                  <DropdownMenuItem
                    key={page.id}
                    onClick={() => handleTemplateSelect(page.id)}
                    className={`p-3 cursor-pointer ${
                      isSelected ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <span className="text-lg flex-shrink-0 mt-0.5">{page.icon}</span>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm truncate">
                            {page.name}
                          </div>
                          {status && getStatusBadge(status)}
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-1">
                          {page.route}
                        </div>

                        {status && (status.hasDraft || status.hasPublished) && (
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            {status.hasDraft && (
                              <div className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span>Draft: {formatLastUpdate(status.lastDraftUpdate)}</span>
                              </div>
                            )}
                            {status.hasPublished && (
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>Live: {formatLastUpdate(status.lastPublishedUpdate)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })
            )}
          </div>

          <DropdownMenuSeparator />
          
          <div className="p-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Pages:</span>
              <span>{realPages.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Published:</span>
              <span>
                {Object.values(templateStatuses).filter(s => s.hasPublished).length}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Modified:</span>
              <span>
                {Object.values(templateStatuses).filter(s => s.hasUnsavedChanges).length}
              </span>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
