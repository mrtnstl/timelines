import type { Timeline, TimelineEvent } from '../../timelines/types/timeline';

export interface EditorDraft {
  timelineId?: string;
  title: string;
  events: TimelineEvent[];
}

export interface CreateTimelineRequest {
  title: string;
}

export interface CreateTimelineResponse {
  message: string;
  data: Timeline;
}

export interface CreateTimelineEventRequest {
  title: string;
  date: string;
  description?: string;
  image?: string;
  serial?: string;
}

export interface CreateTimelineEventResponse {
  message: string;
  data: TimelineEvent;
}
