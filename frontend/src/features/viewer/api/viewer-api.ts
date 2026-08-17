import type { TimelineResponse } from '../../timelines';
import type { PublicTimelineResponse } from '../types/viewer';

export function getPublicTimeline(
  publicID: string,
): Promise<PublicTimelineResponse> {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/p/${publicID}`)
    .then((data) => data.json())
    .then();
}

export function getAnyTimeline(id: string): Promise<TimelineResponse> {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/timelines/${id}`)
    .then((data) => data.json())
    .then();
}
