import { Brain, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="p-2 bg-gradient-to-br from-ai-primary to-ai-accent rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <Sparkles className="h-3 w-3 text-ai-secondary absolute -top-0.5 -right-0.5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              QA Knowledge Base
            </h1>
            <p className="text-sm text-muted-foreground">
              Upload documents and ask questions powered by AI
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};