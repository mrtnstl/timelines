import { AuthStatus } from '../../features/auth';
import { TimelineList } from '../../features/timelines';

export default function Dashboard() {
  return (
    <div className="bg-slate-950">
      <h1 className="font-faculty text-2xl">Dashboard</h1>
      <AuthStatus />
      <TimelineList />
    </div>
  );
}
