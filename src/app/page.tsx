import { getDashboardStats } from '@/lib/genealogy';
import { getActivityLogs, getAllPersons, getAllEvents } from '@/lib/db';
import DashboardClientView from '@/components/dashboard/DashboardClientView';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const allPersons = await getAllPersons();
  const stats = getDashboardStats(allPersons);
  const activities = await getActivityLogs(8);
  const events = await getAllEvents();

  return (
    <DashboardClientView
      stats={stats}
      activities={activities}
      events={events}
    />
  );
}
