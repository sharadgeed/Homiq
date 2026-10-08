import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardIndexPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  if (user.role === 'admin') redirect('/dashboard/admin');
  if (user.role === 'owner') redirect('/dashboard/owner');
  if (user.role === 'operator') redirect('/dashboard/operator');
  if (user.role === 'broker') redirect('/dashboard/broker');
  redirect('/dashboard/renter');
}
