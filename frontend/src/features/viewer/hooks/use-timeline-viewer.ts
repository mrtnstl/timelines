import { useEffect, useState } from 'react';

import { getAnyTimeline, getPublicTimeline } from '../api/viewer-api';
import type { ViewerState } from '../types/viewer';

export function useTimelineViewer(id: string, isPublic: boolean) {
  const [state, setState] = useState<ViewerState>({
    timeline: null,
    events: null,
    isLoading: Boolean(id),
  });

  useEffect(() => {
    if (isPublic) {
      void getPublicTimeline(id).then((res) => {
        setState({
          timeline: res.data.timeline,
          events: res.data.events,
          isLoading: false,
        });
      });
    } else {
      void getAnyTimeline(id).then((res) => {
        setState({
          timeline: res.data,
          events: null,
          isLoading: false,
        });
      });
    }
  }, [id]);

  return state;
}
