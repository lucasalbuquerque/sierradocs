import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface DocumentUploadProps {
  onDrop: (files: File[]) => void;
}

export function DocumentUpload({ onDrop }: DocumentUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "text/plain": [".txt"],
    },
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
      ${isDragActive ? "border-black bg-black" : "border-gray-300"}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <Upload className="h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop files here, or click to select files
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supports PDF, DOCX, and TXT files
        </p>
      </div>
    </div>
  );
}
