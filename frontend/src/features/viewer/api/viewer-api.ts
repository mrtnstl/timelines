import type {
  PublicTimelineResponse,
  TimelineWithEventsResponse,
} from '../types/viewer';

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

export async function getTimelineByID(
  id: string,
): Promise<TimelineWithEventsResponse> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/timelines/${id}?with_events=true`,
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    throw err instanceof Error ? err : new Error(String(err));
  }
}
