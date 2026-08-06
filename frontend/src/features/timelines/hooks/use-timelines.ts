import { useEffect, useState } from 'react';

import { listTimelines } from '../api/timelines-api';
import type { Timeline } from '../types/timeline';

export function useTimelines() {
  const [timelines, setTimelines] = useState<Timeline[]>([]);

  useEffect(() => {
    void listTimelines().then(setTimelines);
  }, []);

  return timelines;
}
