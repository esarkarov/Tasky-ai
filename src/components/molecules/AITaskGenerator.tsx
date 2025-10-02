import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Bot } from 'lucide-react';

interface AITaskGeneratorProps {
  enabled: boolean;
  prompt: string;
  onToggle: (enabled: boolean) => void;
  onPromptChange: (prompt: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const AITaskGenerator = ({ enabled, prompt, onToggle, onPromptChange, onKeyDown }: AITaskGeneratorProps) => (
  <div className="border rounded-md mt-6">
    <div className="flex items-center gap-3 py-2 px-3">
      <Bot className="text-muted-foreground flex-shrink-0" />
      <div className="space-y-0.5 me-auto">
        <Label
          htmlFor="ai_generate"
          className="block text-sm">
          AI Task Generator
        </Label>
        <p className="text-xs text-muted-foreground">Automatically create tasks by providing a simple prompt.</p>
      </div>
      <Switch
        id="ai_generate"
        onCheckedChange={onToggle}
      />
    </div>

    {enabled && (
      <Textarea
        autoFocus
        placeholder="Tell me about your project. What you want to accomplish?"
        className="border-none"
        value={prompt}
        onChange={(e) => onPromptChange(e.currentTarget.value)}
        onKeyDown={onKeyDown}
      />
    )}
  </div>
);
