import type { EditorDraft } from '../types/editor';

export function saveTimelineDraft(draft: EditorDraft): Promise<EditorDraft> {
  return Promise.resolve(draft);
}
