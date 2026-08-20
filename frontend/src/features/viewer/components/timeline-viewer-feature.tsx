import { useParams } from 'react-router';
//import { useTimelineViewer } from '../hooks/use-timeline-viewer';
import { TimelineGraph, type TimelineNode } from './Graph';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import type { EditableTimeline } from '../../editor';
import type { TimelineEvent } from '../../timelines';

interface TimelineViewerFeatureProps {
  timeline: EditableTimeline | null | undefined;
  events: TimelineEvent[] | null | undefined;
}

export function TimelineViewerFeature({
  timeline,
  events,
}: TimelineViewerFeatureProps) {
  const [timelineNodes, setTimelineNodes] = useState<TimelineNode[] | null>(
    null,
  );
  const [selectedEventID, setSelectedEventID] = useState<string | null>(null);

  useEffect(() => {
    assembleTimelineNodes();
  }, [events]);

  if (!timeline) {
    return <p>Timeline not found.</p>;
  }

  function assembleTimelineNodes() {
    const timelineNodes: TimelineNode[] = [];
    if (events == null) {
      return;
    }
    for (let i = 0; i < events.length; i++) {
      timelineNodes.push({
        id: events[i].id,
        label: events[i].title,
        parents: [events[i - 1]?.id || ''],
        active: true,
        date: events[i].date,
      });
    }
    setTimelineNodes(timelineNodes);
  }
  return (
    <section className="overflow-hidden">
      <h1 className="text-center text-xl mt-4 mb-2">{timeline.title}</h1>
      {/* TODO: timeline level description, background image, timeline-type and color options */}
      <p className="max-w-11/12 sm:max-w-4/5 lg:max-w-3/5 text-left mx-auto mb-6 border-b">
        Some description about the currently selected timeline.
      </p>
      {events && timelineNodes && (
        <>
          <TimelineGraph
            nodes={timelineNodes}
            activeColor="#5088d1"
            inactiveColor="#506178"
            className=" mb-10"
            onNodeHover={() => ''}
            onNodeClick={(node) => setSelectedEventID(node.id)}
          />
          {selectedEventID && (
            <section className="max-w-11/12 sm:max-w-4/5 lg:max-w-3/5 px-1 py-1 mx-auto mb-4 border relative">
              <MdClose
                className="absolute z-50 right-0.5 top-0.5"
                onClick={() => setSelectedEventID(null)}
              />
              <h3>
                {(selectedEventID &&
                  events!.find((event) => event.id === selectedEventID)
                    ?.title) || (
                  <span className="w-50 bg-gray-600 text-transparent opacity-30 rounded-md">
                    placeholder_title
                  </span>
                )}
              </h3>
              <small>
                {(selectedEventID &&
                  events!.find((event) => event.id === selectedEventID)
                    ?.date) || (
                  <span className="w-50 bg-gray-600 text-transparent opacity-30 rounded-md">
                    placeholder_date
                  </span>
                )}
              </small>
              <p>
                {(selectedEventID &&
                  events!.find((event) => event.id === selectedEventID)
                    ?.description) || (
                  <span className="w-50 bg-gray-600 text-transparent opacity-30 rounded-md">
                    placeholder_description placeholder_description
                  </span>
                )}
              </p>
            </section>
          )}
        </>
      )}
      {events && (
        <TimelineGraph
          className=""
          activeColor="#ef6746"
          inactiveColor="#717171"
          nodes={[
            {
              id: '1',
              label: 'Project start',
              parents: [],
              active: true,
              date: 'Jan 2024',
            },
            {
              id: '2',
              label: 'Design system',
              parents: ['1'],
              active: true,
              date: 'Feb 2024',
            },
            {
              id: '3',
              label: 'Auth feature',
              parents: ['2'],
              active: true,
              date: 'Mar 2024',
            },
            {
              id: '33',
              label: 'Bug fixes',
              parents: ['3'],
              active: true,
              date: 'Mar 2024',
            },
            {
              id: '4',
              label: 'API v1',
              parents: ['2'],
              active: true,
              date: 'Mar 2024',
            },
            {
              id: '5',
              label: 'Merge auth',
              parents: ['33', '4'],
              active: true,
              date: 'Apr 2024',
            },
            {
              id: '6',
              label: 'Launch',
              parents: ['5'],
              active: true,
              date: 'May 2024',
            },
            {
              id: '7',
              label: 'Hotfix',
              parents: ['6'],
              active: false,
              date: 'May 2024',
            },
          ]}
          onNodeHover={() => ''}
          onNodeClick={() => ''}
        />
      )}
      <TimelineGraph
        className=""
        nodes={[
          {
            id: '1',
            label: 'Project start',
            parents: [],
            active: true,
            date: 'Jan 2024',
          },
          {
            id: '2',
            label: 'Design system',
            parents: ['1'],
            active: true,
            date: 'Feb 2024',
          },
          {
            id: '3',
            label: 'Auth feature',
            parents: ['2'],
            active: true,
            date: 'Mar 2024',
          },
          {
            id: '21',
            label: 'Standup',
            parents: ['3'],
            active: true,
            date: 'Apr 2024',
          },
          {
            id: '4',
            label: 'Notify',
            parents: ['3'],
            active: true,
            date: 'Mar 2024',
          },
          {
            id: '444',
            label: 'Ack',
            parents: ['4'],
            active: true,
            date: 'Mar 2024',
          },
          {
            id: '44',
            label: 'Gather feedback',
            parents: ['4'],
            active: true,
            date: 'Mar 2024',
          },
          {
            id: '2432',
            label: 'Iterate over product',
            parents: ['44'],
            active: true,
            date: 'Mar 2024',
          },
          {
            id: '5',
            label: 'Merge auth',
            parents: ['21'],
            active: false,
            date: 'Apr 2024',
          },
          {
            id: '5a',
            label: 'Deploy on Railway',
            parents: ['5'],
            active: false,
            date: 'Apr 2024',
          },
        ]}
        onNodeHover={() => ''}
        onNodeClick={() => ''}
      />
    </section>
  );
}
