import { useEffect, useState } from 'react';
import {
  TimelineEditorFeature,
  type EditableTimeline,
} from '../../features/editor';
import { TimelineViewerFeature } from '../../features/viewer';
import type { TimelineEvent } from '../../features/timelines';
import { useTimelineEditor } from '../../features/editor/hooks/use-timeline-editor';

export default function TimelineEditor() {
  const [existingTimeline, setExistingTimeline] =
    useState<EditableTimeline | null>();
  const { draft, setDraft } = useTimelineEditor();

  const [events, setEvents] = useState<TimelineEvent[] | null>();

  const [previewTimeline, setPreviewTimeline] =
    useState<EditableTimeline | null>();

  useEffect(() => {
    if (existingTimeline) {
      setDraft(existingTimeline);
    }
  }, [existingTimeline]);

  useEffect(() => {
    if (existingTimeline) {
      const preview: EditableTimeline = {
        ...existingTimeline,
      };
      for (const [key, value] of Object.entries(draft)) {
        // TODO: not too typesafe
        if (value != null) {
          (preview as unknown as Record<string, unknown>)[key] = value;
        }
      }
      setPreviewTimeline(preview);
    }
  }, [existingTimeline, draft, setExistingTimeline, setDraft]);

  return (
    <div className="flex flex-col lg:flex-row">
      <TimelineEditorFeature
        existingTimeline={existingTimeline}
        setExistingTimeline={setExistingTimeline}
        draft={draft}
        setDraft={setDraft}
        setEvents={setEvents}
      />
      <TimelineViewerFeature timeline={previewTimeline} events={events} />
    </div>
  );
}
