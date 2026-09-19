import { useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Upload, Camera, X, ImageUp, Sparkles } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClearImage: () => void;
}

export function ImageUpload({ onImageSelect, selectedImage, onClearImage }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onImageSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="glass-panel w-full">
      <CardContent className="p-6">
        {selectedImage ? (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={URL.createObjectURL(selectedImage)}
                alt="Selected cattle/buffalo"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 img-shade"></div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-3 right-3 rounded-full"
                onClick={onClearImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ImageUp className="w-4 h-4 text-green-600" />
              <p className="text-sm text-muted-foreground">
                Image selected: {selectedImage.name}
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`drop-zone p-8 text-center cursor-pointer ${
              isDragOver ? 'drop-zone-active' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="icon-tile w-24 h-24 rounded-2xl">
                  <Upload className="w-9 h-9 text-green-700" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 text-lg">
                  Upload an image of cattle or buffalo
                </h3>
                <p className="text-muted-foreground text-sm">
                  Drag and drop your image here, or tap to select
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={(e) => { e.stopPropagation(); openFileDialog(); }}
                  variant="outline"
                  className="gap-2 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                  Choose Image
                </Button>
              </div>
              <div className="flex justify-center">
                <span className="chip">
                  <Sparkles className="size-3.5 text-green-600" />
                  AI will identify breed instantly
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, WebP
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}