import type { TimelineResponse } from '../../timelines';
import type { PublicTimelineResponse } from '../types/viewer';

export async function getTimelineByPublicID(
  publicID: string,
): Promise<PublicTimelineResponse> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/p/${publicID}`,
    );
    const data = await response.json();
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error(String(err));
  }
}

export async function getTimelineByID(id: string): Promise<TimelineResponse> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/timelines/${id}`,
    );
    const data = await response.json();
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error(String(err));
  }
}
