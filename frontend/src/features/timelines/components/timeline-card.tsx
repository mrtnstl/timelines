import { useNavigate } from 'react-router';
import { deleteTimeline } from '../api/timelines-api';
import type { Timeline } from '../types/timeline';
import {
  MdAccountTree,
  MdCropOriginal,
  MdDelete,
  MdEdit,
} from 'react-icons/md';
import { TbSpy, TbSpyOff } from 'react-icons/tb';

interface TimelineCardProps extends Timeline {}

export function TimelineCard({
  id,
  title,
  is_published,
  public_id,
  created_at,
  updated_at,
}: TimelineCardProps) {
  const navigate = useNavigate();
  return (
    <div
      className={`border-2 p-1 w-[380px] bg-gray-900 rounded-lg text-gray-400 flex gap-x-1
    ${is_published ? 'border-green-800' : 'border-gray-600'}
    `}
    >
      <div className="flex flex-col items-center justify-around gap-y-1 px-2 py-1">
        <button
          className="button-info"
          onClick={() =>
            is_published
              ? navigate(`/timeline/public/${public_id}`)
              : navigate(`/timeline/private/${id}`)
          }
        >
          <MdCropOriginal size={22} />
        </button>
        <button
          className="button-info"
          onClick={() => navigate(`/editor/edit/${id}`)}
        >
          <MdEdit size={22} />
        </button>
        <button
          className="button-danger"
          onClick={() => deleteTimeline(id, false)}
        >
          <MdDelete size={22} />
        </button>
      </div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between border-b-2 mb-2">
          <h3 className="font-bold">{title}</h3>
          {is_published ? (
            <TbSpy className="text-green-400" />
          ) : (
            <TbSpyOff className="text-gray-500" />
          )}
        </div>
        <div>
          <ul>
            <li className="text-xs">
              created: {new Date(created_at).toLocaleString()}
            </li>
            <li className="text-xs">
              last modified: {new Date(updated_at).toLocaleString()}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
