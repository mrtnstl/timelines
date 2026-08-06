import { AuthStatus } from '../../features/auth';
import { PublishingFeature } from '../../features/publishing';
import { TimelineList } from '../../features/timelines';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <AuthStatus />
      <TimelineList />
      <PublishingFeature />
    </div>
  );
}
