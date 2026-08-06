import type { TimelineEvent } from '../../timelines/types/timeline';

export interface EditorDraft {
  timelineId?: string;
  title: string;
  events: TimelineEvent[];
}
