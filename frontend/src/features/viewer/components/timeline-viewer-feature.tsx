import { useParams } from 'react-router';
import { useTimelineViewer } from '../hooks/use-timeline-viewer';

export function TimelineViewerFeature() {
  const { id, type } = useParams();
  if (!id) {
    return <p>Can't load timeline.</p>;
  }
  const { isLoading, timeline, events, error } = useTimelineViewer(
    id,
    type === 'public',
  );

  if (error) {
    return <p className="text-red-400">{error.message}</p>;
  }

  if (isLoading) {
    return <p>Loading timeline...</p>;
  }

  if (!timeline) {
    return <p>Timeline not found.</p>;
  }

  return (
    <section>
      <h1 className="text-center">{timeline.title}</h1>
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
