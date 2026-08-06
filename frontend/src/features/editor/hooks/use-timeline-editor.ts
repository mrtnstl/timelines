import { useState } from 'react';

import type { EditorDraft } from '../types/editor';

const defaultDraft: EditorDraft = {
  title: 'Untitled timeline',
  events: [],
};

export function useTimelineEditor() {
  const [draft, setDraft] = useState<EditorDraft>(defaultDraft);

  return {
    draft,
    setDraft,
  };
}
