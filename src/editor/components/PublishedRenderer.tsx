import React, { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import { TemplateDocument, ThemeTokens, DeviceType } from '../types';
import ThemeRenderer from '../renderers/ThemeRenderer';

interface PublishedRendererProps {
  templateId: string;
  deviceType?: DeviceType;
  fallback?: React.ReactNode;
}

function usePublishedTemplate(templateId: string) {
  const [template, setTemplate] = useState<TemplateDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    async function fetchOnce() {
      try {
        const data = await apiGet(`/api/templates/${templateId}/published`);
        if (!cancelled) setTemplate(data);
      } catch (e) {
        if (!cancelled) setError('Failed to load published content');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchOnce();
    return () => { cancelled = true; };
  }, [templateId]);

  return { template, loading, error } as const;
}

export default function PublishedRenderer({ templateId, deviceType = 'desktop', fallback }: PublishedRendererProps) {
  const { template, loading } = usePublishedTemplate(templateId);

  if (loading && !template) {
    return (
      <div className="w-full min-h-40 flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading content...</div>
      </div>
    );
  }

  if (!template) {
    return <>{fallback ?? null}</>;
  }

  return (
    <ThemeRenderer template={template} deviceType={deviceType} />
  );
}


