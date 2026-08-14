import type {
  CreateTimelineEventRequest,
  CreateTimelineEventResponse,
  CreateTimelineRequest,
  CreateTimelineResponse,
  EditorDraft,
} from '../types/editor';

export function saveTimelineDraft(draft: EditorDraft): Promise<EditorDraft> {
  return Promise.resolve(draft);
}

export function createTimeline(
  payload: CreateTimelineRequest,
): Promise<CreateTimelineResponse> {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/timelines`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((data) => data.json())
    .then();
}

export function createTimelineEvent(
  timelineID: string,
  payload: CreateTimelineEventRequest,
): Promise<CreateTimelineEventResponse> {
  return fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/timelines/${timelineID}/events`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )
    .then((data) => data.json())
    .then();
}
