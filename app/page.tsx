import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">My Auth App</h1>
      <div className="flex gap-4">
        <Link href="/register" className="rounded bg-blue-600 px-4 py-2 text-white">
          Register
        </Link>
        <Link href="/login" className="rounded bg-gray-700 px-4 py-2 text-white">
          Login
        </Link>
      </div>
    </main>
  );
}