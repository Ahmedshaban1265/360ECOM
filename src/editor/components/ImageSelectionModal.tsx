import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadMedia } from '@/editor/services/MediaService';
import ShopifyImageLibrary, { ImageItem } from './ShopifyImageLibrary';

interface ImageSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (image: ImageItem) => void;
  multiple?: boolean;
}

export default function ImageSelectionModal({ 
  open, 
  onOpenChange, 
  onSelect,
  multiple = false 
}: ImageSelectionModalProps) {
  const [view, setView] = useState<'selection' | 'library'>('selection');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDirectUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const result = await uploadMedia(file, 'theme-media', (progress) => {
        setUploadProgress(progress);
      });
      
      // Create ImageItem from the upload result
      const imageItem: ImageItem = {
        url: result.url,
        path: result.path,
        name: file.name,
        uploadedAt: new Date()
      };
      
      onSelect(imageItem);
      onOpenChange(false);
      setView('selection'); // Reset view for next time
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleDirectUpload(file);
    }
  };

  const handleLibrarySelect = (images: ImageItem[]) => {
    if (images.length > 0) {
      onSelect(images[0]); // For now, just select the first image
      onOpenChange(false);
      setView('selection'); // Reset view for next time
    }
  };

  const handleCloseLibrary = () => {
    setView('selection');
  };

  // If showing the library view, render the ShopifyImageLibrary
  if (view === 'library') {
    return (
      <ShopifyImageLibrary
        open={true}
        onOpenChange={handleCloseLibrary}
        onSelect={handleLibrarySelect}
        multiple={multiple}
      />
    );
  }

  // Main selection view
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Upload from Device Option */}
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="p-6">
              <label className="cursor-pointer block">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Upload from device</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a file from your computer
                    </p>
                  </div>
                  
                  {isUploading && (
                    <div className="w-full space-y-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs text-muted-foreground">
                          Uploading... {Math.round(uploadProgress)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                  disabled={isUploading}
                />
              </label>
            </CardContent>
          </Card>

          {/* Choose from Library Option */}
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setView('library')}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Choose from image library</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse and select from existing images
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
