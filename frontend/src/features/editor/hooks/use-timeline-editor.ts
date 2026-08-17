import { useState } from 'react';

import type { EditorDraft } from '../types/editor';

const defaultDraft: EditorDraft = {
  timelineId: undefined,
  is_published: undefined,
  title: '',
  version: -1,
};

export function useTimelineEditor() {
  const [draft, setDraft] = useState<EditorDraft>(defaultDraft);

  return {
    draft,
    setDraft,
  };
}
