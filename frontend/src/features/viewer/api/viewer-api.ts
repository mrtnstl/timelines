import type { Timeline } from '../../timelines/types/timeline';

export function getPublicTimeline(publicId?: string): Promise<Timeline | null> {
  if (!publicId) {
    return Promise.resolve(null);
  }

  return Promise.resolve(null);
}
