import { deleteTimeline } from '../api/timelines-api';
import type { Timeline } from '../types/timeline';

interface TimelineCardProps extends Timeline {}

export function TimelineCard({
  id,
  title,
  is_published,
  created_at,
  updated_at,
}: TimelineCardProps) {
  return (
    <div className="border-2 p-1 w-[380px]">
      <h3 className="border-b-2">
        {title} ({is_published ? 'public' : 'private'})
      </h3>
      <div>
        <ul>
          <li>created: {new Date(created_at).toISOString()}</li>
          <li>last modified: {updated_at.toString()}</li>
        </ul>
      </div>
      <button
        className="button-info"
        onClick={() => console.log(`Open ${id} in viewer`)}
      >
        VIEW
      </button>
      <button
        className="button-info"
        onClick={() => console.log(`Open ${id} in editor`)}
      >
        EDIT
      </button>
      <button
        className="button-danger"
        onClick={() => deleteTimeline(id, false)}
      >
        DELETE (soft)
      </button>
    </div>
  );
}
