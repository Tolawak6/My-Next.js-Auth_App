import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import LogoutButton from './logout-button';

export const instant = false;
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>
        Welcome, <span className="font-mono">{session.email}</span>
      </p>
      <p className="text-sm text-gray-500">Your user ID is {session.userId}</p>
      <LogoutButton />
    </main>
  );
}