import type {
  DeleteTimelineResponse,
  TimelineResponse,
  TimelinesResponse,
} from '../types/timeline';

export function listTimelines(): Promise<TimelinesResponse> {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/timelines`)
    .then((data) => data.json())
    .then();
}

export function getTimeline(timelineID: string): Promise<TimelineResponse> {
  return fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/timelines/${timelineID}`,
  )
    .then((data) => data.json())
    .then();
}

export function deleteTimeline(
  timelineID: string,
  isHardDelete: boolean,
): Promise<DeleteTimelineResponse> {
  return fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/timelines/${timelineID}?hard=${isHardDelete ? true : false}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
    .then((data) => data.json())
    .then();
}
