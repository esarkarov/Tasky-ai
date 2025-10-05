import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface AIPromptInputProps {
  prompt: string;
  onChange: (prompt: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const AIPromptInput = ({ prompt, onChange, onKeyDown }: AIPromptInputProps) => {
  return (
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
        onChange={(e) => onChange(e.currentTarget.value)}
        onKeyDown={onKeyDown}
        aria-describedby="ai-task-generator-description"
      />
    </div>
  );
};
