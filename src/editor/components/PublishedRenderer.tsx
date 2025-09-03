import React, { useEffect, useMemo, useState } from 'react';
import { TemplateDocument, ThemeTokens, DeviceType } from '../types';
import ThemeRenderer from '../renderers/ThemeRenderer';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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
    let isCancelled = false;
    setLoading(true);
    setError(null);
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/templates/${templateId}/published`);
        const data = res.ok ? await res.json() : null;
        if (!isCancelled) setTemplate(data);
      } catch (err) {
        if (!isCancelled) setError('Failed to load published content');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 10000);
    return () => { isCancelled = true; clearInterval(interval); };
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


