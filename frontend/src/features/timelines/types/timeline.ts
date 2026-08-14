export interface TimelineEvent {
  id: string;
  timeline_id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  serial: number;
  version: number;
  created_at: Date;
  updated_at: Date;
}

export interface Timeline {
  id: string;
  is_published: boolean;
  owner_id: string;
  public_id: string;
  title: string;
  version: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface TimelinesResponse {
  data: Timeline[];
}

export interface TimelineResponse {
  data: Timeline;
}

export interface TimelineEventsResponse {
  data: TimelineEvent[];
}

export interface TimelineEventResponse {
  data: TimelineEvent;
}

export interface DeleteTimelineResponse {
  message: string;
}
