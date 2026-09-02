import { NextResponse } from 'next/server';
import { getAllPersons, getActivityLogs } from '@/lib/db';
import { getDashboardStats } from '@/lib/genealogy';

export async function GET() {
  try {
    const persons = getAllPersons();
    const stats = getDashboardStats(persons);
    const activity = getActivityLogs(10);
    return NextResponse.json({ stats, activity });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
