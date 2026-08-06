import { usePublishing } from '../hooks/use-publishing';

export function PublishingFeature() {
  const status = usePublishing('demo-timeline');

  return (
    <section>
      <h2>Publishing</h2>
      <p>{status?.isPublished ? 'Published' : 'Not published'}</p>
    </section>
  );
}
