import { useState, useEffect } from 'react';
import { useEditorStore, useSelectedTemplate } from '../store/editorStore';
import { TEMPLATE_LIST } from '../defaults/templates';
import { storageService } from '../services/StorageService';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

// Icons
import { 
  Plus, 
  FileText, 
  Eye, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface TemplateStatus {
  id: string;
  hasDraft: boolean;
  hasPublished: boolean;
  hasUnsavedChanges: boolean;
  lastDraftUpdate?: string;
  lastPublishedUpdate?: string;
}

export default function LeftNavTemplates() {
  const selectedTemplate = useSelectedTemplate();
  const { loadTemplate } = useEditorStore();
  const [templateStatuses, setTemplateStatuses] = useState<Record<string, TemplateStatus>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load template statuses
  useEffect(() => {
    async function loadStatuses() {
      setIsLoading(true);
      const statuses: Record<string, TemplateStatus> = {};

      for (const template of TEMPLATE_LIST) {
        try {
          const status = await storageService.getTemplateStatus(template.id);
          statuses[template.id] = {
            id: template.id,
            ...status
          };
        } catch (error) {
          console.error(`Failed to load status for template ${template.id}:`, error);
          statuses[template.id] = {
            id: template.id,
            hasDraft: false,
            hasPublished: false,
            hasUnsavedChanges: false
          };
        }
      }

      setTemplateStatuses(statuses);
      setIsLoading(false);
    }

    loadStatuses();
  }, [selectedTemplate]); // Refresh when template changes

  const handleTemplateSelect = async (templateId: string) => {
    try {
      await loadTemplate(templateId);
    } catch (error) {
      console.error('Failed to load template:', error);
    }
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

  const getTemplateIcon = (templateId: string) => {
    const template = TEMPLATE_LIST.find(t => t.id === templateId);
    return template?.icon || '📄';
  };

  const getStatusBadge = (status: TemplateStatus) => {
    if (!status.hasDraft && !status.hasPublished) {
      return (
        <Badge variant="outline" className="text-xs">
          New
        </Badge>
      );
    }

    if (status.hasUnsavedChanges) {
      return (
        <Badge variant="secondary" className="text-xs">
          <AlertCircle className="w-3 h-3 mr-1" />
          Modified
        </Badge>
      );
    }

    if (status.hasPublished) {
      return (
        <Badge variant="default" className="text-xs">
          <Eye className="w-3 h-3 mr-1" />
          Live
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="text-xs">
        Draft
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Templates</h2>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Select a template to edit
        </p>
      </div>

      {/* Template List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {TEMPLATE_LIST.map((template) => {
            const status = templateStatuses[template.id];
            const isSelected = selectedTemplate === template.id;

            return (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  isSelected ? 'ring-2 ring-primary ring-offset-2 bg-accent/50' : ''
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTemplateIcon(template.id)}</span>
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {template.name}
                        </CardTitle>
                        {template.route && (
                          <CardDescription className="text-xs">
                            {template.route}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    {status && getStatusBadge(status)}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {template.description && (
                    <p className="text-xs text-muted-foreground mb-3">
                      {template.description}
                    </p>
                  )}

                  {status && (
                    <div className="space-y-1">
                      {status.hasDraft && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Draft
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatLastUpdate(status.lastDraftUpdate)}
                          </span>
                        </div>
                      )}

                      {status.hasPublished && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Published
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatLastUpdate(status.lastPublishedUpdate)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-between">
            <span>Templates:</span>
            <span>{TEMPLATE_LIST.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Published:</span>
            <span>
              {Object.values(templateStatuses).filter(s => s.hasPublished).length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Modified:</span>
            <span>
              {Object.values(templateStatuses).filter(s => s.hasUnsavedChanges).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
