import { useState } from 'react';
import { useTimelineEditor } from '../hooks/use-timeline-editor';
import type {
  CreateTimelineEventRequest,
  CreateTimelineRequest,
} from '../types/editor';
import { createTimeline } from '../api/editor-api';

export function TimelineEditorFeature() {
  //const { draft, setDraft } = useTimelineEditor();
  const [newTimeline, setNewTimeline] = useState<CreateTimelineRequest>({
    title: '',
  });
  const [showEventEditor, setShowEventEditor] = useState(false);
  const [newEvent, setNewEvent] = useState<CreateTimelineEventRequest>({
    title: '',
    date: '',
    description: undefined,
    image: undefined,
    serial: undefined,
  });
  return (
    <section>
      <h1>Timeline Editor</h1>
      <small>{JSON.stringify(newTimeline)}</small>
      <form action="" className="flex flex-col">
        <label htmlFor="tl-title">Title</label>
        <input
          name="tl-title"
          id="tl-title"
          type="text"
          placeholder="title"
          onChange={(e) =>
            setNewTimeline({ ...newTimeline, title: e.target.value })
          }
        />
        <button onClick={() => createTimeline(newTimeline)}>SAVE</button>
      </form>
      <button onClick={() => setShowEventEditor(!showEventEditor)}>
        + EVENT
      </button>
      {showEventEditor && (
        <form action="" className="flex flex-col">
          <h3>Event Editor</h3>
          <small>{JSON.stringify(newEvent)}</small>
          <label htmlFor="te-title">title*</label>
          <input
            name="te-title"
            id="te-title"
            type="text"
            placeholder="title"
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <label htmlFor="te-date">date*</label>
          <input
            name="te-date"
            id="te-date"
            type="text"
            placeholder="date"
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <label htmlFor="te-desc">description</label>
          <input
            name="te-desc"
            id="te-desc"
            type="text"
            placeholder="description"
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          <label htmlFor="te-image">image</label>
          <input
            name="te-image"
            id="te-image"
            type="text"
            placeholder="image url"
            onChange={(e) =>
              setNewEvent({ ...newEvent, image: e.target.value })
            }
          />
          <label htmlFor="te-serial">serial</label>
          <input
            name="te-serial"
            id="te-serial"
            type="number"
            placeholder="0"
            onChange={(e) =>
              setNewEvent({ ...newEvent, serial: e.target.value })
            }
          />
          <button onClick={() => ''}>SAVE</button>
        </form>
      )}
    </section>
  );
}
