import { useEffect, useState } from 'react';

import { getPublishStatus } from '../api/publishing-api';
import type { PublishStatus } from '../types/publishing';

export function usePublishing(timelineId?: string) {
  const [status, setStatus] = useState<PublishStatus | null>(null);

  useEffect(() => {
    void getPublishStatus(timelineId).then(setStatus);
  }, [timelineId]);

  return status;
}
