import { useEffect, useState } from 'react';

import { getPublicTimeline } from '../api/viewer-api';
import type { ViewerState } from '../types/viewer';

export function useTimelineViewer(publicId?: string) {
  const [state, setState] = useState<ViewerState>({
    timeline: null,
    isLoading: Boolean(publicId),
  });

  useEffect(() => {
    void getPublicTimeline(publicId).then((timeline) => {
      setState({ timeline, isLoading: false });
    });
  }, [publicId]);

  return state;
}
