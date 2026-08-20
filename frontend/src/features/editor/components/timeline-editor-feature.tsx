import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

//import { useTimelineEditor } from '../hooks/use-timeline-editor';
import {
  createTimeline,
  createTimelineEvent,
  getEvents,
  updateTimeline,
} from '../api/editor-api';
import type {
  CreateTimelineEventRequest,
  EditableTimeline,
  EditorDraft,
} from '../types/editor';
import { getTimeline } from '../../timelines/api/timelines-api';
import type { TimelineEvent } from '../../timelines';
import { TimelineForm } from './timeline-form';
import { EventForm } from './event-form';

const defaultNewEvent: CreateTimelineEventRequest = {
  title: '',
  date: '',
  description: undefined,
  image: undefined,
  serial: undefined,
};

interface TimelineEditorFeatureProps {
  existingTimeline: EditableTimeline | null | undefined;
  setExistingTimeline: React.Dispatch<
    React.SetStateAction<EditableTimeline | null | undefined>
  >;
  draft: EditorDraft;
  setDraft: React.Dispatch<React.SetStateAction<EditorDraft>>;
  setEvents: React.Dispatch<
    React.SetStateAction<TimelineEvent[] | null | undefined>
  >;
}

export function TimelineEditorFeature({
  existingTimeline,
  setExistingTimeline,
  draft,
  setDraft,
  setEvents,
}: TimelineEditorFeatureProps) {
  const navigate = useNavigate();
  const { id: timelineID, mode } = useParams();

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
        setExistingTimeline({
          id: timeline.id,
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
        const updateResponse = await updateTimeline(timelineID, {
          title: draft.title.trim(),
          is_published: draft.is_published,
          version: draft.version,
        });
        setDraft({
          ...draft,
          version: updateResponse.data.new_version,
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
    <section className="border-r">
      <h1 className="font-faculty text-2xl">
        {isCreateMode ? 'Create Timeline' : 'Edit Timeline'}
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <TimelineForm
        onSubmit={handleSaveTimeline}
        draft={draft}
        onTitleChange={(e) => setDraft({ ...draft, title: e.target.value })}
        isSaving={isSavingTimeline}
      />

      <button
        type="button"
        onClick={() => setShowEventEditor((v) => !v)}
        disabled={!timelineID}
        className="global_button"
      >
        + Event
      </button>

      {!timelineID && <p>Save timeline first to enable event creation.</p>}
      {/*events && (
        <ul>
          {events.map((event) => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ul>
      )*/}
      {showEventEditor && (
        <EventForm
          onSubmit={handleSaveEvent}
          newEvent={newEvent}
          onInputChange={(e) =>
            setNewEvent({ ...newEvent, [e.target.name]: e.target.value })
          }
          isSaving={isSavingEvent}
        />
      )}
    </section>
  );
}
