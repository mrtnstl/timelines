import type { Timeline, TimelineEvent } from '../../timelines/types/timeline';

export interface ViewerState {
  timeline: Timeline | null;
  events: TimelineEvent[] | null;
  isLoading: boolean;
  error: Error | null;
}

export interface PublicTimelineResponse {
  data: {
    timeline: Timeline;
    events: TimelineEvent[] | null;
  };
}

export interface TimelineResponse {
  data: {
    timeline: Timeline;
    events: TimelineEvent[] | null;
  };
}
