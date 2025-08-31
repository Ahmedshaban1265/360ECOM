import React, { useEffect, useMemo, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/firebase';
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
    setLoading(true);
    setError(null);
    const ref = doc(db, 'theme_published_v1', templateId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setTemplate((snap.exists() ? (snap.data() as TemplateDocument) : null));
        setLoading(false);
      },
      (err) => {
        console.error('Failed to subscribe to published template', err);
        setError('Failed to load published content');
        setLoading(false);
      }
    );
    return () => unsub();
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


