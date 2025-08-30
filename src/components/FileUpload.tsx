import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string;
}

interface FileUploadProps {
  onFileProcessed: (file: UploadedFile) => void;
  currentFile: UploadedFile | null;
  onRemoveFile: () => void;
}

export const FileUpload = ({ onFileProcessed, currentFile, onRemoveFile }: FileUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/process-file', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Failed to process file');
      }

      const result = await response.json();
      
      const processedFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        content: result.content,
      };

      onFileProcessed(processedFile);
      
      toast({
        title: "File processed successfully",
        description: `${file.name} is ready for Q&A`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error processing file",
        description: "Please try again or use a different file format",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    },
    multiple: false,
    disabled: isProcessing,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (currentFile) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <File className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{currentFile.name}</h3>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(currentFile.size)} • Ready for Q&A
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveFile}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
      <div
        {...getRootProps()}
        className={`p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'bg-primary/5' : ''
        } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">
              {isDragActive ? 'Drop your file here' : 'Upload a document'}
            </h3>
            <p className="text-muted-foreground">
              Drag & drop or click to upload PDF, DOCX, or PPTX files
            </p>
          </div>

          {isProcessing && (
            <div className="w-full max-w-xs space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">Processing file...</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};