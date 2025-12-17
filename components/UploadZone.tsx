import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelected(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 ease-in-out
        ${isDragging ? 'scale-105 ring-4 ring-chef-orange/50' : 'hover:shadow-xl'}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-dashed border-stone-300 group-hover:border-chef-orange w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept="image/*"
          onChange={onInputChange}
          disabled={isLoading}
        />
        
        {isLoading ? (
            <div className="flex flex-col items-center animate-pulse">
                <Loader2 className="w-16 h-16 text-chef-orange animate-spin mb-4" />
                <p className="text-stone-500 font-medium">Analizando texturas e ingredientes...</p>
            </div>
        ) : (
            <>
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-50 transition-colors">
                <Upload className="w-10 h-10 text-stone-400 group-hover:text-chef-orange" />
                </div>
                <h3 className="text-2xl font-serif text-stone-800 mb-2 text-center">
                Sube tu Platillo
                </h3>
                <p className="text-stone-500 text-center mb-6 max-w-xs">
                Arrastra y suelta una foto clara de comida, o haz clic para buscar.
                </p>
                <div className="flex gap-4 text-xs text-stone-400">
                    <span className="flex items-center"><ImageIcon className="w-3 h-3 mr-1"/> JPG</span>
                    <span className="flex items-center"><ImageIcon className="w-3 h-3 mr-1"/> PNG</span>
                    <span className="flex items-center"><ImageIcon className="w-3 h-3 mr-1"/> WEBP</span>
                </div>
            </>
        )}
      </div>
      
      {/* Polaroid effect background */}
      <div className="absolute -z-10 top-4 left-4 right-4 bottom-4 bg-stone-200 rounded-xl transform rotate-2 transition-transform group-hover:rotate-3"></div>
      <div className="absolute -z-20 top-4 left-4 right-4 bottom-4 bg-stone-300 rounded-xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
    </div>
  );
};

export default UploadZone;