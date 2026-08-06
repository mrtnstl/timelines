import type { Timeline } from '../types/timeline';

export function listTimelines(): Promise<Timeline[]> {
  return Promise.resolve([
    {
      id: 'asdasd',
      ownerId: 'asdsa2d3ad',
      title: 'test timeline',
      events: [
        {
          id: 'a1',
          title: 'project start',
          date: new Date().toISOString(),
          description: 'this marks the start of the project',
        },
      ],
      isPublished: false,
    },
  ]);
}
