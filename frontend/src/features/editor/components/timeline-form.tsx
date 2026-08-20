import type { EditorDraft } from '../types/editor';

interface TimelineFormProps {
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
  draft: EditorDraft;
  onTitleChange: (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => void;
  isSaving: boolean;
  className?: string;
}

export function TimelineForm({
  onSubmit,
  draft,
  onTitleChange,
  isSaving,
  className,
}: TimelineFormProps) {
  return (
    <form className={`flex flex-col ${className ?? ''}`} onSubmit={onSubmit}>
      <label htmlFor="tl-title">Title</label>
      <input
        id="tl-title"
        type="text"
        placeholder="title"
        value={draft.title}
        onChange={onTitleChange}
      />

      <button type="submit" disabled={isSaving} className="global_button">
        {isSaving ? 'Saving...' : 'Save Timeline'}
      </button>
    </form>
  );
}
