import { useTimelines } from '../hooks/use-timelines';

export function TimelineList() {
  const timelines = useTimelines();

  return (
    <section>
      <h2>Timelines</h2>
      <p>Count: {timelines.length}</p>

      <ul>
        {timelines.map((item) => (
          <div key={item.id} className="border-2 p-0.5">
            <h3>
              {item.title} ({item.isPublished ? 'public' : 'private'})
            </h3>

            <ul className="border-t-2">
              {item.events.map((event) => (
                <li key={event.id} className="border-l-2 my-2">
                  <h4>{event.title}</h4>
                  <small>{event.date}</small>
                  <p>{event.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </section>
  );
}
