import { useParams } from 'react-router';

import { useTimelineViewer } from '../hooks/use-timeline-viewer';

export function TimelineViewerFeature() {
  const { public_id: publicId } = useParams();
  const { isLoading, timeline } = useTimelineViewer(publicId);

  if (isLoading) {
    return <p>Loading timeline...</p>;
  }

  if (!timeline) {
    return <p>Timeline not found.</p>;
  }

  return (
    <section>
      <h1>{timeline.title}</h1>
      <p>Events: {timeline.events.length}</p>
    </section>
  );
}
