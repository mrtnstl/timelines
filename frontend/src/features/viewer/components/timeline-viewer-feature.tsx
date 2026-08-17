import { useParams } from 'react-router';
import { useTimelineViewer } from '../hooks/use-timeline-viewer';
import { useState } from 'react';

interface TimelineViewerFeatureProps {
  isPublic: boolean;
}

export function TimelineViewerFeature({
  isPublic,
}: TimelineViewerFeatureProps) {
  const { id } = useParams();
  if (!id) {
    return <p>Can't load timeline.</p>;
  }
  const { isLoading, timeline, events } = useTimelineViewer(id, isPublic);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return <p>Loading timeline...</p>;
  }

  if (!timeline) {
    return <p>Timeline not found.</p>;
  }

  return (
    <section>
      <h1 className="text-center">{timeline.title}</h1>
      <p></p>
      {events && (
        <ul className="flex flex-col text-center">
          {events.map((event) => (
            <li
              key={event.id}
              className="border-1 border-gray-700 flex flex-col"
            >
              <span>
                {event.date} {event.title.toUpperCase()}
              </span>
              <span>{event.description || ''}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
