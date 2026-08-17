import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useTimelineEditor } from '../hooks/use-timeline-editor';
import {
  createTimeline,
  createTimelineEvent,
  getEvents,
  updateTimeline,
} from '../api/editor-api';
import type { CreateTimelineEventRequest } from '../types/editor';
import { getTimeline } from '../../timelines/api/timelines-api';
import type { TimelineEvent } from '../../timelines';

const defaultNewEvent: CreateTimelineEventRequest = {
  title: '',
  date: '',
  description: undefined,
  image: undefined,
  serial: undefined,
};

export function TimelineEditorFeature() {
  const navigate = useNavigate();
  const { id: timelineID, mode } = useParams();
  const { draft, setDraft } = useTimelineEditor();

  const [events, setEvents] = useState<TimelineEvent[] | null>();

  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';

  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isSavingTimeline, setIsSavingTimeline] = useState(false);
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showEventEditor, setShowEventEditor] = useState(false);
  const [newEvent, setNewEvent] =
    useState<CreateTimelineEventRequest>(defaultNewEvent);

  useEffect(() => {
    if (!isEditMode || !timelineID) return;

    let isActive = true;
    setIsLoadingInitial(true);
    setError(null);

    getTimeline(timelineID)
      .then((res) => {
        if (!isActive) return;
        const timeline = res.data;
        setDraft({
          timelineId: timeline.id,
          is_published: timeline.is_published,
          title: timeline.title,
          version: timeline.version,
        });
      })
      .catch(() => {
        if (!isActive) return;
        setError('Failed to load timeline.');
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoadingInitial(false);
      });

    getEvents(timelineID)
      .then((res) => {
        setEvents(res.data);
      })
      .catch(() => {
        setError('Failed to load events.');
      })
      .finally();
    return () => {
      isActive = false;
    };
  }, [isEditMode, timelineID, setDraft]);

  async function handleSaveTimeline(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!draft.title.trim()) {
      setError('Title is required.');
      return;
    }

    setIsSavingTimeline(true);
    setError(null);

    try {
      if (isCreateMode) {
        const res = await createTimeline({ title: draft.title.trim() });
        navigate('/editor/edit/' + res.data.id);
        return;
      }

      if (isEditMode && timelineID) {
        await updateTimeline(timelineID, {
          title: draft.title.trim(),
          is_published: draft.is_published,
          version: draft.version,
        });
      }
    } catch {
      setError('Failed to save timeline.');
    } finally {
      setIsSavingTimeline(false);
    }
  }

  async function handleSaveEvent(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!timelineID) {
      setError('Save timeline first, then add events.');
      return;
    }

    if (!newEvent.title.trim() || !newEvent.date.trim()) {
      setError('Event title and date are required.');
      return;
    }

    setIsSavingEvent(true);
    setError(null);

    try {
      await createTimelineEvent(timelineID, {
        ...newEvent,
        title: newEvent.title.trim(),
        date: newEvent.date.trim(),
      });
      setNewEvent(defaultNewEvent);
      setShowEventEditor(false);
    } catch {
      setError('Failed to save event.');
    } finally {
      setIsSavingEvent(false);
    }
  }

  if (!isCreateMode && !isEditMode) {
    return <p>Invalid editor mode.</p>;
  }

  if (isEditMode && !timelineID) {
    return <p>Timeline id is required in edit mode.</p>;
  }

  if (isLoadingInitial) {
    return <p>Loading timeline...</p>;
  }

  return (
    <section>
      <h1>{isCreateMode ? 'Create Timeline' : 'Edit Timeline'}</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form className="flex flex-col" onSubmit={handleSaveTimeline}>
        <label htmlFor="tl-title">Title</label>
        <input
          id="tl-title"
          type="text"
          placeholder="title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />

        <button type="submit" disabled={isSavingTimeline}>
          {isSavingTimeline ? 'Saving...' : 'Save Timeline'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setShowEventEditor((v) => !v)}
        disabled={!timelineID}
      >
        + Event
      </button>

      {!timelineID && <p>Save timeline first to enable event creation.</p>}
      {events && (
        <ul>
          {events.map((event) => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ul>
      )}
      {showEventEditor && (
        <form className="flex flex-col" onSubmit={handleSaveEvent}>
          <h3>Event Editor</h3>

          <label htmlFor="te-title">Title*</label>
          <input
            id="te-title"
            type="text"
            placeholder="title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />

          <label htmlFor="te-date">Date*</label>
          <input
            id="te-date"
            type="text"
            placeholder="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />

          <label htmlFor="te-desc">Description</label>
          <input
            id="te-desc"
            type="text"
            placeholder="description"
            value={newEvent.description ?? ''}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                description: e.target.value || undefined,
              })
            }
          />

          <label htmlFor="te-image">Image</label>
          <input
            id="te-image"
            type="text"
            placeholder="image url"
            value={newEvent.image ?? ''}
            onChange={(e) =>
              setNewEvent({ ...newEvent, image: e.target.value || undefined })
            }
          />

          <label htmlFor="te-serial">Serial</label>
          <input
            id="te-serial"
            type="number"
            placeholder="0"
            value={newEvent.serial ?? ''}
            onChange={(e) =>
              setNewEvent({ ...newEvent, serial: e.target.value || undefined })
            }
          />

          <button type="submit" disabled={isSavingEvent}>
            {isSavingEvent ? 'Saving...' : 'Save Event'}
          </button>
        </form>
      )}
    </section>
  );
}
