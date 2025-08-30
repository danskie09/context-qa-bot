import { useState } from 'react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { ChatInterface } from '@/components/ChatInterface';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string;
}

const Index = () => {
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(null);

  const handleFileProcessed = (file: UploadedFile) => {
    setCurrentFile(file);
  };

  const handleRemoveFile = () => {
    setCurrentFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* File Upload Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Upload Document
              </h2>
              <p className="text-muted-foreground">
                Upload a PDF, DOCX, or PPTX file to start asking questions about its content.
              </p>
            </div>
            
            <FileUpload
              onFileProcessed={handleFileProcessed}
              currentFile={currentFile}
              onRemoveFile={handleRemoveFile}
            />

            {currentFile && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-foreground">
                    Document processed and ready for Q&A
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  You can now ask questions about the content in the chat interface.
                </p>
              </div>
            )}
          </div>

          {/* Chat Interface Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Ask Questions
              </h2>
              <p className="text-muted-foreground">
                Chat with AI to get answers based on your uploaded document.
              </p>
            </div>
            
            <ChatInterface fileId={currentFile?.id || null} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
