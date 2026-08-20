import { useParams } from 'react-router';
import { ThemeSwitcher } from '../../features/theme/components/theme-switcher';
import { TimelineViewerFeature } from '../../features/viewer';
import { useTimelineViewer } from '../../features/viewer/hooks/use-timeline-viewer';

export default function TimelineViewer() {
  const { id, type } = useParams();

  if (!id) {
    return <p>Can't load timeline.</p>;
  }

  const { isLoading, timeline, events, error } = useTimelineViewer(
    id,
    type === 'public',
  );

  /*useEffect(() => {
    console.log('events count', events?.length ?? 0);
  }, [id, events]);*/

  if (error) {
    return <p className="text-red-400">{error.message}</p>;
  }

  if (isLoading) {
    return <p>Loading timeline...</p>;
  }

  return (
    <>
      <ThemeSwitcher />
      <TimelineViewerFeature timeline={timeline} events={events} />
    </>
  );
}
