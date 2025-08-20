import React, { useEffect, useMemo, useRef, useState } from 'react';
import { storage } from '@/firebase';
import { listAll, ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface ImageItem {
  url: string;
  path: string;
}

interface ImageLibraryProps {
  root?: string;
  onSelect?: (image: ImageItem) => void;
}

export default function ImageLibrary({ root = 'theme-media', onSelect }: ImageLibraryProps) {
  const [currentPrefix, setCurrentPrefix] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('media_prefix');
      if (saved && saved.startsWith(root)) return saved;
    } catch {}
    return root;
  });
  const [folders, setFolders] = useState<string[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState('');
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [pageSize] = useState<number>(60);
  const [showing, setShowing] = useState<number>(60);
  const urlCacheRef = useRef<Map<string, string>>(new Map());

  const breadcrumbs = useMemo(() => {
    const parts = currentPrefix.split('/');
    const trail: { name: string; path: string }[] = [];
    let acc = '';
    parts.forEach((p, idx) => {
      if (!p) return;
      acc = acc ? `${acc}/${p}` : p;
      trail.push({ name: p, path: acc });
    });
    return trail;
  }, [currentPrefix]);

  const loadList = async () => {
    setIsLoading(true);
    try {
      const folderRef = ref(storage, currentPrefix);
      const res = await listAll(folderRef);
      setFolders(res.prefixes.map((p) => p.name));
      const items: ImageItem[] = await Promise.all(
        res.items.map(async (itemRef) => {
          const cached = urlCacheRef.current.get(itemRef.fullPath);
          if (cached) return { url: cached, path: itemRef.fullPath };
          const url = await getDownloadURL(itemRef);
          urlCacheRef.current.set(itemRef.fullPath, url);
          return { url, path: itemRef.fullPath };
        })
      );
      setImages(items);
      setShowing(pageSize);
    } catch (e) {
      console.error('Failed to load images', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadList();
    try { localStorage.setItem('media_prefix', currentPrefix); } catch {}
  }, [currentPrefix]);

  const onUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'bin';
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const prefix = currentPrefix.endsWith('/') ? currentPrefix : `${currentPrefix}/`;
      const fileRef = ref(storage, `${prefix}${name}`);
      const task = uploadBytesResumable(fileRef, file);
      task.on('state_changed', (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        if (progressRef.current) progressRef.current.style.width = pct + '%';
      }, (err) => {
        console.error(err);
      }, async () => {
        await loadList();
        setIsUploading(false);
      });
    } catch (e) {
      console.error('Upload failed', e);
      setIsUploading(false);
    }
  };

  const createFolder = async (name: string) => {
    if (!name) return;
    try {
      // Create a placeholder file to materialize the folder
      const prefix = currentPrefix.endsWith('/') ? currentPrefix : `${currentPrefix}/`;
      const keepRef = ref(storage, `${prefix}${name}/.keep`);
      const blob = new Blob([new Uint8Array()], { type: 'application/octet-stream' });
      await uploadBytesResumable(keepRef, blob);
      await loadList();
    } catch (e) {
      console.error('Create folder failed', e);
    }
  };

  const navigateTo = (path: string) => {
    setCurrentPrefix(path);
    setSelectedPaths(new Set());
  };

  const removeImage = async (path: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await deleteObject(ref(storage, path));
      await loadList();
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const renameImage = async (oldPath: string, newName: string) => {
    try {
      if (!newName) return;
      const segments = oldPath.split('/');
      const folder = segments.slice(0, -1).join('/');
      const newPath = `${folder}/${newName}`;
      await moveImage(oldPath, newPath);
      await loadList();
    } catch (e) {
      console.error('Rename failed', e);
    }
  };

  const moveImage = async (oldPath: string, newPath: string) => {
    try {
      if (oldPath === newPath) return;
      const oldRef = ref(storage, oldPath);
      const resp = await fetch(await getDownloadURL(oldRef));
      const blob = await resp.blob();
      const newRef = ref(storage, newPath);
      await uploadBytesResumable(newRef, blob);
      await deleteObject(oldRef);
    } catch (e) {
      console.error('Move failed', e);
      throw e;
    }
  };

  const moveSelectedToFolder = async () => {
    const target = prompt('Move to folder (relative to root):', currentPrefix);
    if (!target) return;
    const cleanTarget = target.replace(/\/$/, '');
    try {
      for (const path of Array.from(selectedPaths)) {
        const fileName = path.split('/').pop() as string;
        await moveImage(path, `${cleanTarget}/${fileName}`);
      }
      setSelectedPaths(new Set());
      await loadList();
    } catch (e) {
      console.error('Bulk move failed', e);
    }
  };

  const bulkDelete = async () => {
    if (selectedPaths.size === 0) return;
    if (!confirm(`Delete ${selectedPaths.size} file(s)?`)) return;
    try {
      await Promise.all(Array.from(selectedPaths).map((p) => deleteObject(ref(storage, p))));
      setSelectedPaths(new Set());
      await loadList();
    } catch (e) {
      console.error('Bulk delete failed', e);
    }
  };

  const filteredImages = useMemo(() => {
    if (!search) return images;
    return images.filter((i) => i.path.toLowerCase().includes(search.toLowerCase()));
  }, [images, search]);

  const visibleImages = useMemo(() => filteredImages.slice(0, showing), [filteredImages, showing]);

  const toggleSelected = (path: string) => {
    setSelectedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center gap-2">
        {/* Breadcrumbs */}
        <div className="text-xs flex items-center gap-1">
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={b.path}>
              <button className="underline-offset-2 hover:underline" onClick={() => navigateTo(b.path)}>
                {b.name}
              </button>
              {idx < breadcrumbs.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </div>
        <label className="inline-flex items-center gap-2">
          <Input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
          }} />
        </label>
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 text-xs" />
        {isUploading && (
          <div className="flex-1 h-2 bg-muted rounded">
            <div ref={progressRef} className="h-2 bg-primary rounded" style={{ width: '0%' }} />
          </div>
        )}
        <Button variant="outline" size="sm" onClick={loadList} disabled={isLoading}>
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={() => {
          const name = prompt('New folder name');
          if (name) createFolder(name);
        }}>
          New Folder
        </Button>
        {selectedPaths.size > 0 && (
          <>
            <Button size="sm" variant="destructive" onClick={bulkDelete}>
              Delete Selected ({selectedPaths.size})
            </Button>
            <Button size="sm" variant="outline" onClick={moveSelectedToFolder}>
              Move Selected
            </Button>
          </>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-3 gap-2 p-3">
          {/* Folders */}
          {folders.map((name) => (
            <button key={name} className="relative group" onClick={() => navigateTo(`${currentPrefix.replace(/\/$/, '')}/${name}`)}>
              <Card className="overflow-hidden flex items-center justify-center h-24 text-xs">
                📁 {name}
              </Card>
            </button>
          ))}
          {/* Files */}
          {visibleImages.map((img) => (
            <div key={img.path} className="relative group">
              <Card className="overflow-hidden">
                <img src={img.url} alt="" className="w-full h-24 object-cover" />
              </Card>
              <label className="absolute top-1 left-1 bg-white/70 rounded px-1 py-0.5 text-[10px] flex items-center gap-1">
                <input type="checkbox" checked={selectedPaths.has(img.path)} onChange={() => toggleSelected(img.path)} />
                <span>Select</span>
              </label>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition p-1 flex items-end gap-1 justify-center">
                {onSelect && <Button size="sm" className="h-6 text-xs" onClick={() => onSelect(img)}>Select</Button>}
                <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => removeImage(img.path)}>Delete</Button>
                <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => {
                  const newName = prompt('Rename file to (include extension):', img.path.split('/').pop() || '');
                  if (newName) renameImage(img.path, newName);
                }}>Rename</Button>
                <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => {
                  const target = prompt('Move to folder (relative to root):', currentPrefix);
                  if (target) {
                    const cleanTarget = target.replace(/\/$/, '');
                    const fileName = img.path.split('/').pop() as string;
                    moveImage(img.path, `${cleanTarget}/${fileName}`).then(loadList);
                  }
                }}>Move</Button>
              </div>
            </div>
          ))}
          {!isLoading && folders.length === 0 && filteredImages.length === 0 && (
            <div className="text-sm text-muted-foreground">No images yet. Upload to get started.</div>
          )}
        </div>
        {filteredImages.length > showing && (
          <div className="p-3 flex justify-center">
            <Button size="sm" variant="outline" onClick={() => setShowing((s) => s + pageSize)}>Load More</Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}