import { TimelineEditorFeature } from '../../features/editor';
import { TimelineViewerFeature } from '../../features/viewer';

export default function TimelineEditor() {
  return (
    <div className="flex flex-col lg:flex-row">
      <TimelineEditorFeature />
      <TimelineViewerFeature />
    </div>
  );
}
