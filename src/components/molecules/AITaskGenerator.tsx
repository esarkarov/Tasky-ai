import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Bot } from 'lucide-react';

interface AITaskGeneratorProps {
  enabled: boolean;
  prompt: string;
  onToggle: (enabled: boolean) => void;
  onPromptChange: (prompt: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const AITaskGenerator = ({ enabled, prompt, onToggle, onPromptChange, onKeyDown }: AITaskGeneratorProps) => (
  <section
    className="mt-6 rounded-md border"
    aria-labelledby="ai-task-generator-label">
    <div className="flex items-center gap-3 px-3 py-2">
      <Bot
        className="flex-shrink-0 text-muted-foreground"
        aria-hidden="true"
      />

      <div className="me-auto space-y-0.5">
        <Label
          id="ai-task-generator-label"
          htmlFor="ai_generate"
          className="block text-sm font-medium">
          AI Task Generator
        </Label>
        <p
          id="ai-task-generator-description"
          className="text-xs text-muted-foreground">
          Automatically create tasks by providing a simple prompt.
        </p>
      </div>

      <Switch
        id="ai_generate"
        aria-describedby="ai-task-generator-description"
        checked={enabled}
        onCheckedChange={onToggle}
      />
    </div>

    {enabled && (
      <div className="px-3 pb-3">
        <Label
          htmlFor="ai_prompt"
          className="sr-only">
          AI task prompt
        </Label>
        <Textarea
          id="ai_prompt"
          autoFocus
          placeholder="Tell me about your project. What do you want to accomplish?"
          className="border-none focus-visible:ring-2 focus-visible:ring-ring"
          value={prompt}
          onChange={(e) => onPromptChange(e.currentTarget.value)}
          onKeyDown={onKeyDown}
          aria-describedby="ai-task-generator-description"
        />
      </div>
    )}
  </section>
);
