import { NextResponse } from 'next/server';
import { getAllPersons, getActivityLogs } from '@/lib/db';
import { getDashboardStats } from '@/lib/genealogy';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const persons = await getAllPersons();
    const stats = getDashboardStats(persons);
    const activity = await getActivityLogs(10);
    return NextResponse.json({ stats, activity });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
