import { useTimelines } from '../hooks/use-timelines';

export function TimelineList() {
  const timelines = useTimelines();

  return (
    <section>
      <h2>Timelines</h2>
      <p>Count: {timelines.length}</p>

      {timelines && timelines.length > 0 && (
        <ul>
          {timelines.map((item) => (
            <div id={item.id} className="border-2 p-0.5">
              <h3>
                {item.title} ({item.isPublished ? 'public' : 'private'})
              </h3>
              {item.events && item.events.length > 0 && (
                <ul>
                  {item.events.map((event) => (
                    <li id={event.id}>
                      <h4>{event.title}</h4>
                      <small>{event.date}</small>
                      <p>{event.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ul>
      )}
    </section>
  );
}
