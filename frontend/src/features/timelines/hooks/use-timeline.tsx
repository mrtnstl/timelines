import { useEffect, useState } from 'react';

import type { Timeline } from '../types/timeline';
import { getTimeline } from '../api/timelines-api';

export function useTimeline(timelineID: string) {
  const [timeline, setTimeline] = useState<Timeline>();

  useEffect(() => {
    getTimeline(timelineID).then((res) => setTimeline(res.data));
  }, []);

  return timeline;
}
