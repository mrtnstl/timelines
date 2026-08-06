import { useTimelineEditor } from '../hooks/use-timeline-editor';

export function TimelineEditorFeature() {
  const { draft } = useTimelineEditor();

  return (
    <section>
      <h1>Timeline Editor</h1>
      <p>{draft.title}</p>
    </section>
  );
}
