import { AuthStatus } from '../../features/auth';
import { TimelineList } from '../../features/timelines';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <AuthStatus />
      <TimelineList />
    </div>
  );
}
