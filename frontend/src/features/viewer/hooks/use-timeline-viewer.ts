import { useEffect, useState } from 'react';

import type { ViewerState } from '../types/viewer';
import { getTimelineByID, getTimelineByPublicID } from '../api/viewer-api';

export function useTimelineViewer(id: string, isPublic: boolean) {
  const [state, setState] = useState<ViewerState>({
    timeline: null,
    events: null,
    isLoading: Boolean(id),
    error: null,
  });

  useEffect(() => {
    if (isPublic) {
      (async () => {
        try {
          const timeline = await getTimelineByPublicID(id);
          setState({
            timeline: timeline.data.timeline,
            events: timeline.data.events,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          setState({
            ...state,
            isLoading: false,
            error: err as Error, // 100% sure this is of type Error
          });
        }
      })();
    } else {
      (async () => {
        try {
          const timeline = await getTimelineByID(id);
          setState({
            timeline: timeline.data.timeline,
            events: timeline.data.events,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          setState({
            ...state,
            isLoading: false,
            error: err as Error, // 100% sure this is of type Error
          });
        }
      })();
    }
  }, [id]);

  return state;
}
