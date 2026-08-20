import { useTimelines } from '../hooks/use-timelines';
import { TimelineCard } from './timeline-card';

export function TimelineList() {
  const timelines = useTimelines();

  return (
    <section>
      <h2 className="font-faculty text-xl">Timelines</h2>
      <p>You have {timelines.length} timelines</p>

      <ul className="mx-2 flex flex-wrap gap-x-1 gap-y-0.5">
        {timelines.map((item) => (
          <TimelineCard
            key={item.id}
            id={item.id}
            title={item.title}
            is_published={item.is_published}
            owner_id={item.owner_id}
            public_id={item.public_id}
            version={item.version}
            created_at={item.created_at}
            updated_at={item.updated_at}
            deleted_at={item.deleted_at}
          />
        ))}
      </ul>
    </section>
  );
}
