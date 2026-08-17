import { TimelineEditorFeature } from '../../features/editor';
import { TimelineViewerFeature } from '../../features/viewer';

export default function TimelineEditor() {
  return (
    <>
      <TimelineEditorFeature />
      <TimelineViewerFeature isPublic />
    </>
  );
}
