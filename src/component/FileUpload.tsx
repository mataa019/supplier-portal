import { useState, useRef } from 'react';
import {
  DocumentIcon,
  CloudArrowUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { DocumentIcon as DocumentSolid } from '@heroicons/react/24/solid';

interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  required?: boolean;
  onFileSelect: (file: File | null) => void;
  hint?: string;
}

export default function FileUpload({
  id,
  label,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  maxSize = 5,
  required = false,
  onFileSelect,
  hint,
}: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    setError(null);
    
    if (!file) {
      setFileName(null);
      onFileSelect(null);
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setFileName(file.name);
    onFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    setFileName(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-red-500 bg-red-50'
            : error
            ? 'border-red-300 bg-red-50'
            : fileName
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          id={id}
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          required={required && !fileName}
        />
        
        {fileName ? (
          <div className="flex items-center justify-center gap-3">
            <DocumentSolid className="w-8 h-8 text-green-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">{fileName}</p>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
              >
                <XMarkIcon className="w-3 h-3" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <CloudArrowUpIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Drag and drop your file here, or{' '}
              <span className="text-red-600 font-medium">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Max file size: {maxSize}MB
            </p>
          </>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
}
