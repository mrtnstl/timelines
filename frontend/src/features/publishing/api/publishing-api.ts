import type { PublishStatus } from '../types/publishing';

export function getPublishStatus(
  timelineId?: string,
): Promise<PublishStatus | null> {
  if (!timelineId) {
    return Promise.resolve(null);
  }

  return Promise.resolve({
    timelineId,
    isPublished: false,
  });
}
