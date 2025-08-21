import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { storage } from '@/firebase';
import { listAll, ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, Upload, Image as ImageIcon, X, Check, Plus, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ImageItem {
  url: string;
  path: string;
  name: string;
  size?: number;
  uploadedAt?: Date;
}

interface ShopifyImageLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (images: ImageItem[]) => void;
  multiple?: boolean;
  root?: string;
}

export default function ShopifyImageLibrary({ 
  open, 
  onOpenChange, 
  onSelect, 
  multiple = false,
  root = 'theme-media' 
}: ShopifyImageLibraryProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageItem[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [search, setSearch] = useState('');
  const [fileSizeFilter, setFileSizeFilter] = useState('all');
  const [usedInFilter, setUsedInFilter] = useState('all');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const loadImages = useCallback(async (retryCount = 0) => {
    const maxRetries = 3;
    setIsLoading(true);

    try {
      console.log(`Loading images... (attempt ${retryCount + 1})`);

      // Add timeout for the operation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Operation timeout')), 30000); // 30 second timeout
      });

      const loadPromise = async () => {
        const folderRef = ref(storage, root);

        // Try to list with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        if (retryCount > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const res = await listAll(folderRef);

        // Process images in smaller batches to avoid overwhelming Firebase
        const batchSize = 10;
        const imageItems: ImageItem[] = [];
        const filteredItems = res.items.filter(item => {
          const name = item.name.toLowerCase();
          return name.endsWith('.jpg') || name.endsWith('.jpeg') ||
                 name.endsWith('.png') || name.endsWith('.gif') ||
                 name.endsWith('.webp') || name.endsWith('.svg');
        });

        for (let i = 0; i < filteredItems.length; i += batchSize) {
          const batch = filteredItems.slice(i, i + batchSize);
          const batchPromises = batch.map(async (itemRef) => {
            try {
              const url = await getDownloadURL(itemRef);
              return {
                url,
                path: itemRef.fullPath,
                name: itemRef.name,
                uploadedAt: new Date(parseInt(itemRef.name.split('-')[0]) || Date.now())
              };
            } catch (urlError) {
              console.warn(`Failed to get download URL for ${itemRef.name}:`, urlError);
              return null;
            }
          });

          const batchResults = await Promise.all(batchPromises);
          imageItems.push(...batchResults.filter(item => item !== null) as ImageItem[]);

          // Small delay between batches
          if (i + batchSize < filteredItems.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        return imageItems;
      };

      const imageItems = await Promise.race([loadPromise(), timeoutPromise]) as ImageItem[];

      // Sort by upload date (newest first)
      imageItems.sort((a, b) => (b.uploadedAt?.getTime() || 0) - (a.uploadedAt?.getTime() || 0));

      setImages(imageItems);
      setFilteredImages(imageItems);

      console.log(`Successfully loaded ${imageItems.length} images`);

    } catch (error: any) {
      console.error(`Failed to load images (attempt ${retryCount + 1}):`, error);

      // Handle specific Firebase errors
      if (error?.code === 'storage/retry-limit-exceeded' ||
          error?.code === 'storage/timeout' ||
          error?.message === 'Operation timeout') {

        if (retryCount < maxRetries) {
          console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
          // Retry with exponential backoff
          setTimeout(() => loadImages(retryCount + 1), Math.min(1000 * Math.pow(2, retryCount), 5000));
          return;
        } else {
          console.error('Max retries exceeded. Please check your internet connection and Firebase configuration.');
          // Set empty array if all retries failed
          setImages([]);
          setFilteredImages([]);
        }
      } else if (error?.code === 'storage/object-not-found') {
        console.log('No images folder found, starting with empty library');
        setImages([]);
        setFilteredImages([]);
      } else {
        console.error('Unexpected error loading images:', error);
        setImages([]);
        setFilteredImages([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [root]);

  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open, loadImages]);

  // Filter images based on search and filters
  useEffect(() => {
    let filtered = images;

    // Search filter
    if (search) {
      filtered = filtered.filter(img => 
        img.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // File size filter (simplified)
    if (fileSizeFilter !== 'all') {
      // This is a simplified filter - in a real implementation you'd get actual file sizes
      // For now we'll just filter by extension as a proxy
      if (fileSizeFilter === 'small') {
        filtered = filtered.filter(img => img.name.includes('.webp') || img.name.includes('.jpg'));
      } else if (fileSizeFilter === 'large') {
        filtered = filtered.filter(img => img.name.includes('.png') || img.name.includes('.gif'));
      }
    }

    setFilteredImages(filtered);
  }, [images, search, fileSizeFilter, usedInFilter]);

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const ext = file.name.split('.').pop() || 'bin';
        const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const fileRef = ref(storage, `${root}/${name}`);
        
        return new Promise<ImageItem>((resolve, reject) => {
          const task = uploadBytesResumable(fileRef, file);
          
          task.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(task.snapshot.ref);
              resolve({
                url,
                path: task.snapshot.ref.fullPath,
                name,
                uploadedAt: new Date()
              });
            }
          );
        });
      });

      const newImages = await Promise.all(uploadPromises);
      
      // Add new images to the beginning of the list
      const updatedImages = [...newImages, ...images];
      setImages(updatedImages);
      setFilteredImages(updatedImages);
      
      // Auto-select uploaded images if in single select mode
      if (!multiple && newImages.length === 1) {
        setSelectedImages(new Set([newImages[0].path]));
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const toggleImageSelection = (imagePath: string) => {
    const newSelected = new Set(selectedImages);
    
    if (multiple) {
      if (newSelected.has(imagePath)) {
        newSelected.delete(imagePath);
      } else {
        newSelected.add(imagePath);
      }
    } else {
      newSelected.clear();
      newSelected.add(imagePath);
    }
    
    setSelectedImages(newSelected);
  };

  const handleDone = () => {
    const selectedImageObjects = images.filter(img => selectedImages.has(img.path));
    onSelect(selectedImageObjects);
    onOpenChange(false);
    setSelectedImages(new Set());
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedImages(new Set());
  };

  const selectedImagesList = images.filter(img => selectedImages.has(img.path));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl">Images</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {/* Search and Filters Bar */}
          <div className="px-6 pb-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search files"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setSearch('');
                  setFileSizeFilter('all');
                  setUsedInFilter('all');
                }}
              >
                Sort
                <Badge variant="secondary" className="ml-1">1</Badge>
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <Select value={fileSizeFilter} onValueChange={setFileSizeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="File size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">File size</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={usedInFilter} onValueChange={setUsedInFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Used in" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Used in</SelectItem>
                  <SelectItem value="pages">Pages</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-6 h-96">
            {/* Main Content Area */}
            <div className="flex-1 px-6">
              {/* Upload Area */}
              <div
                ref={dropAreaRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors",
                  isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                )}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add files
                    </Button>
                    
                    <Button variant="outline" className="gap-2" disabled>
                      <Wand2 className="w-4 h-4" />
                      Generate image
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    or drop files to upload
                  </p>
                  
                  {isUploading && (
                    <div className="w-full max-w-xs">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploading... {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />
              </div>

              {/* Images Grid */}
              <ScrollArea className="h-64">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-sm text-muted-foreground">Loading images...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-6 gap-3 pb-4">
                    {filteredImages.map((image) => {
                      const isSelected = selectedImages.has(image.path);
                      return (
                        <div
                          key={image.path}
                          className={cn(
                            "relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                            isSelected ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                          )}
                          onClick={() => toggleImageSelection(image.path)}
                        >
                          <div className="aspect-square">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Selection Checkbox */}
                          <div className={cn(
                            "absolute top-2 left-2 w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                            isSelected 
                              ? "bg-primary border-primary" 
                              : "bg-white border-muted-foreground/30 group-hover:border-muted-foreground"
                          )}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      );
                    })}
                    
                    {!isLoading && filteredImages.length === 0 && (
                      <div className="col-span-6 flex flex-col items-center justify-center h-32 text-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {search ? 'No images found matching your search.' : 'No images yet. Upload some to get started!'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Right Sidebar - Preview */}
            <div className="w-80 border-l px-6 py-4">
              <h3 className="font-medium mb-4">
                {selectedImagesList.length === 0 
                  ? 'Select images' 
                  : `${selectedImagesList.length} selected`
                }
              </h3>
              
              {selectedImagesList.length > 0 && (
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {selectedImagesList.map((image) => (
                      <div key={image.path} className="flex items-center gap-3 p-2 rounded-lg border">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{image.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {image.uploadedAt?.toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleImageSelection(image.path)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleDone}
            disabled={selectedImages.size === 0}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
