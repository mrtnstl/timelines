import type { Timeline } from '../../timelines/types/timeline';

export interface ViewerState {
  timeline: Timeline | null;
  isLoading: boolean;
}
