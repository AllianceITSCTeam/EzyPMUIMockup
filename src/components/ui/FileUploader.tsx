import React, { useRef, useState } from "react";
import { UploadCloud, X, File as FileIcon } from "lucide-react";

export interface AttachedFile {
  name: string;
  size: string;
}

interface FileUploaderProps {
  initialFiles?: AttachedFile[];
}

export function FileUploader({ initialFiles = [] }: FileUploaderProps) {
  const [files, setFiles] = useState<AttachedFile[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: AttachedFile[] = Array.from(fileList).map(f => ({
      name: f.name,
      size: formatSize(f.size)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleDelete = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-lg p-6 flex flex-col items-center justify-center text-text-secondary cursor-pointer transition-all duration-200 border-2 border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]
          ${isDragging ? "bg-primary/5 border-primary/30" : "bg-page-bg hover:bg-page-bg/80"}`}
      >
        <UploadCloud className={`w-8 h-8 mb-2 ${isDragging ? "text-primary" : "opacity-30"}`} />
        <p className="text-sm">Drag and drop files here, or <span className="text-primary font-medium">browse</span></p>
        <input 
          type="file" 
          multiple 
          className="hidden" 
          ref={fileInputRef} 
          onChange={(e) => processFiles(e.target.files)} 
        />
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((file, i) => (
            <li key={i} className="flex justify-between items-center px-3 py-2 bg-surface shadow-sm rounded-md text-sm group transition-all duration-200 hover:shadow-md border-l-2 border-l-primary/50">
              <div className="flex items-center gap-2 truncate">
                <FileIcon className="w-4 h-4 text-text-secondary opacity-70 shrink-0" />
                <span className="font-medium text-text-primary hover:text-primary transition-colors cursor-pointer truncate">
                  {file.name}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-xs text-text-secondary">{file.size}</span>
                <button 
                  onClick={() => handleDelete(i)}
                  className="text-text-secondary hover:text-danger hover:bg-danger/10 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
