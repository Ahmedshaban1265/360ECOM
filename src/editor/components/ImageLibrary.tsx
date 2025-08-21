import React, { useEffect, useMemo, useRef, useState } from 'react';
import { storage } from '@/firebase';
import { listAll, ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Upload, 
  FolderPlus, 
  RefreshCw, 
  Grid3X3, 
  List,
  Tag,
  MoreVertical,
  Download,
  Copy,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ImageItem {
  url: string;
  path: string;
  name: string;
  size?: number;
  uploadedAt?: Date;
  tags?: string[];
  category?: string;
}

interface ImageLibraryProps {
  root?: string;
  onSelect?: (image: ImageItem) => void;
  showUploadButton?: boolean;
  showSearch?: boolean;
  showFolders?: boolean;
  compact?: boolean;
}

export default function ImageLibrary({ 
  root = 'theme-media', 
  onSelect, 
  showUploadButton = true,
  showSearch = true,
  showFolders = true,
  compact = false
}: ImageLibraryProps) {
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const progressRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    console.log('Starting to load images from:', currentPrefix);
    setIsLoading(true);
    try {
      const folderRef = ref(storage, currentPrefix);
      console.log('Folder reference created:', folderRef);
      
      const res = await listAll(folderRef);
      console.log('List result:', res);
      console.log('Found prefixes:', res.prefixes.length);
      console.log('Found items:', res.items.length);
      
      setFolders(res.prefixes.map((p) => p.name));
      
      if (res.items.length === 0) {
        console.log('No items found, setting empty array');
        setImages([]);
        setIsLoading(false);
        return;
      }
      
      console.log('Processing items with Promise.allSettled...');
      const settled = await Promise.allSettled(
        res.items.map(async (itemRef, index) => {
          console.log(`Processing item ${index + 1}/${res.items.length}:`, itemRef.name);
          try {
            const url = await getDownloadURL(itemRef);
            const name = itemRef.name;
            const path = itemRef.fullPath;
            const pathParts = path.split('/');
            const category = pathParts.length > 2 ? pathParts[1] : 'general';
            const item: ImageItem = {
              url,
              path,
              name,
              category,
              uploadedAt: new Date(),
              tags: [category, name.split('.')[0]]
            };
            console.log(`Item ${index + 1} processed successfully:`, item);
            return item;
          } catch (itemError) {
            console.error(`Error processing item ${index + 1}:`, itemError);
            throw itemError;
          }
        })
      );
      
      console.log('All items processed, filtering results...');
      const items: ImageItem[] = settled
        .filter((r): r is PromiseFulfilledResult<ImageItem> => r.status === 'fulfilled')
        .map((r) => r.value);
      
      console.log('Final items array:', items);
      setImages(items);
    } catch (e) {
      console.error('Failed to load images:', e);
      setImages([]);
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadList();
    try { localStorage.setItem('media_prefix', currentPrefix); } catch {}
  }, [currentPrefix]);

  const onUpload = async (file: File) => {
    const fileId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setIsUploading(true);
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
    
    try {
      console.log('Starting upload for file:', file.name, 'Size:', file.size);
      console.log('Current prefix:', currentPrefix);
      console.log('Storage reference:', storage);
      
      const ext = file.name.split('.').pop() || 'bin';
      const name = `${file.name.split('.')[0]}-${Date.now()}.${ext}`;
      const prefix = currentPrefix.endsWith('/') ? currentPrefix : `${currentPrefix}/`;
      const fullPath = `${prefix}${name}`;
      console.log('Full path:', fullPath);
      
      const fileRef = ref(storage, fullPath);
      console.log('File reference created:', fileRef);
      
      const task = uploadBytesResumable(fileRef, file);
      console.log('Upload task created:', task);
      
      task.on('state_changed', (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        console.log('Upload progress:', pct + '%');
        setUploadProgress(prev => ({ ...prev, [fileId]: pct }));
      }, (err) => {
        console.error('Upload error:', err);
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        setIsUploading(false);
      }, async () => {
        console.log('Upload completed successfully');
        try {
          // Immediately add the new image to the list
          const downloadURL = await getDownloadURL(task.snapshot.ref);
          console.log('Download URL obtained:', downloadURL);
          
          const newImage: ImageItem = {
            url: downloadURL,
            path: task.snapshot.ref.fullPath,
            name: name,
            category: currentPrefix.split('/')[1] || 'general',
            uploadedAt: new Date(),
            tags: [name.split('.')[0]]
          };
          
          console.log('New image object:', newImage);
          setImages(prev => [newImage, ...prev]);
          
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
          setIsUploading(false);
        } catch (downloadError) {
          console.error('Error getting download URL:', downloadError);
          setIsUploading(false);
        }
      });
    } catch (e) {
      console.error('Upload failed:', e);
      setIsUploading(false);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
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
  };

  const removeImage = async (path: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await deleteObject(ref(storage, path));
      setImages(prev => prev.filter(img => img.path !== path));
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const copyImageUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      // Could add a toast notification here
    } catch (e) {
      console.error('Failed to copy URL', e);
    }
  };

  const downloadImage = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  const filteredImages = useMemo(() => {
    let filtered = images;
    
    if (search) {
      filtered = filtered.filter((i) => 
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.path.toLowerCase().includes(search.toLowerCase()) ||
        i.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((i) => i.category === selectedCategory);
    }
    
    return filtered;
  }, [images, search, selectedCategory]);

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(images.map(img => img.category).filter(Boolean))];
    return cats;
  }, [images]);

  const testStorage = async () => {
    try {
      console.log('Testing Firebase Storage access...');
      const testRef = ref(storage, 'test-connection.txt');
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      
      console.log('Attempting to upload test file...');
      const uploadTask = uploadBytesResumable(testRef, testBlob);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          console.log('Test upload progress:', snapshot.bytesTransferred, '/', snapshot.totalBytes);
        },
        (error) => {
          console.error('Test upload failed:', error);
        },
        async () => {
          console.log('Test upload successful!');
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Test file URL:', url);
            
            // Clean up test file
            await deleteObject(testRef);
            console.log('Test file cleaned up');
          } catch (cleanupError) {
            console.error('Failed to cleanup test file:', cleanupError);
          }
        }
      );
    } catch (error) {
      console.error('Storage test failed:', error);
    }
  };

  const isUploadingAny = Object.keys(uploadProgress).length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border space-y-3">
        {/* Breadcrumbs */}
        {showFolders && (
          <div className="text-xs flex items-center gap-1 flex-wrap">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={b.path}>
                <button 
                  className="underline-offset-2 hover:underline text-muted-foreground hover:text-foreground transition-colors" 
                  onClick={() => navigateTo(b.path)}
                >
                  {b.name}
                </button>
                {idx < breadcrumbs.length - 1 && <span className="text-muted-foreground">/</span>}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Controls Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Upload Button */}
          {showUploadButton && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach(file => onUpload(file));
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="hidden"
              />
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-3 w-3 mr-1" />
                Upload
              </Button>
            </>
          )}

          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 text-xs pl-8"
              />
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className="h-8 px-2"
            >
              <Grid3X3 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="h-8 px-2"
            >
              <List className="h-3 w-3" />
            </Button>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-8 text-xs border rounded-md px-2 bg-background"
            aria-label="Filter by category"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Action Buttons */}
          <Button variant="outline" size="sm" onClick={loadList} disabled={isLoading} className="h-8 text-xs">
            <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {showFolders && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const name = prompt('New folder name');
                if (name) createFolder(name);
              }}
              className="h-8 text-xs"
            >
              <FolderPlus className="h-3 w-3 mr-1" />
              New Folder
            </Button>
          )}
          
          {/* Test Storage Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={testStorage}
            className="h-8 text-xs"
          >
            Test Storage
          </Button>
        </div>

        {/* Upload Progress */}
        {isUploadingAny && (
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="w-full h-2 bg-muted rounded overflow-hidden">
                <div 
                  className="h-2 bg-primary rounded transition-all duration-300" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-3 gap-3">
              {/* Folders */}
              {showFolders && folders.map((name) => (
                <button 
                  key={name} 
                  className="relative group" 
                  onClick={() => navigateTo(`${currentPrefix.replace(/\/$/, '')}/${name}`)}
                >
                  <Card className="overflow-hidden flex items-center justify-center h-24 text-xs hover:shadow-md transition-shadow">
                    <div className="text-center">
                      <div className="text-2xl mb-1">📁</div>
                      <div className="text-muted-foreground">{name}</div>
                    </div>
                  </Card>
                </button>
              ))}
              
              {/* Images */}
              {filteredImages.map((img) => (
                <div key={img.path} className="relative group">
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img 
                        src={img.url} 
                        alt={img.name} 
                        className="w-full h-24 object-cover" 
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end justify-center">
                        <div className="flex gap-1">
                          {onSelect && (
                            <Button size="sm" className="h-6 text-xs" onClick={() => onSelect(img)}>
                              Select
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => copyImageUrl(img.url)}>
                                <Copy className="h-3 w-3 mr-2" />
                                Copy URL
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => downloadImage(img.url, img.name)}>
                                <Download className="h-3 w-3 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => removeImage(img.path)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-2">
                      <div className="text-xs font-medium truncate">{img.name}</div>
                      {img.tags && img.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {img.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs h-4 px-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {/* List View */}
              {filteredImages.map((img) => (
                <div key={img.path} className="flex items-center gap-3 p-2 border rounded-md hover:bg-muted/50 transition-colors">
                  <img 
                    src={img.url} 
                    alt={img.name} 
                    className="w-12 h-12 object-cover rounded" 
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{img.name}</div>
                    <div className="text-xs text-muted-foreground">{img.path}</div>
                    {img.tags && img.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {img.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs h-4 px-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {onSelect && (
                      <Button size="sm" variant="outline" onClick={() => onSelect(img)}>
                        Select
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyImageUrl(img.url)}>
                          <Copy className="h-3 w-3 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => downloadImage(img.url, img.name)}>
                          <Download className="h-3 w-3 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => removeImage(img.path)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && folders.length === 0 && filteredImages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm font-medium">No images yet</p>
              <p className="text-xs">Upload some images to get started</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm">Loading images...</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
