import type { CreateTimelineEventRequest } from '../types/editor';

interface EventFormProps {
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
  newEvent: CreateTimelineEventRequest;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => void;
  isSaving: boolean;
}

export function EventForm({
  onSubmit,
  newEvent,
  onInputChange,
  isSaving,
}: EventFormProps) {
  return (
    <form className="flex flex-col" onSubmit={onSubmit}>
      <h3>Event Editor</h3>

      <label htmlFor="te-title">Title*</label>
      <input
        id="te-title"
        type="text"
        name="title"
        placeholder="title"
        value={newEvent.title}
        onChange={onInputChange}
      />

      <label htmlFor="te-date">Date*</label>
      <input
        id="te-date"
        type="text"
        name="date"
        placeholder="date"
        value={newEvent.date}
        onChange={onInputChange}
      />

      <label htmlFor="te-desc">Description</label>
      <input
        id="te-desc"
        type="text"
        name="description"
        placeholder="description"
        value={newEvent.description ?? ''}
        onChange={onInputChange}
      />

      <label htmlFor="te-image">Image</label>
      <input
        id="te-image"
        type="text"
        name="image"
        placeholder="image url"
        value={newEvent.image ?? ''}
        onChange={onInputChange}
      />

      <label htmlFor="te-serial">Serial</label>
      <input
        id="te-serial"
        type="number"
        name="serial"
        placeholder="0"
        value={newEvent.serial ?? ''}
        onChange={onInputChange}
      />

      <button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Event'}
      </button>
    </form>
  );
}
