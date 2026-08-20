import type { Timeline, TimelineEvent } from '../../timelines/types/timeline';

export interface EditorDraft {
  timeline_id?: string;
  is_published?: boolean;
  title: string;
  version: number;
}

export interface EditableTimeline {
  id: string;
  is_published: boolean;
  title: string;
  version: number;
}

export interface CreateTimelineRequest {
  title: string;
}

export interface CreateTimelineResponse {
  message: string;
  data: Timeline;
}

export interface UpdateTimelineRequest {
  //id: string; id in route param
  title?: string;
  is_published?: boolean;
  version: number;
}

export interface UpdateTimelineResponse {
  message: string;
  data: {
    new_version: number;
  };
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

export interface UpdateEventRequest {
  title?: string;
  date?: string;
  description?: string;
  image?: string;
  serial?: number;
  version: number;
}

export interface UpdateEventResponse {
  message: string;
  data: { new_version: number };
}
