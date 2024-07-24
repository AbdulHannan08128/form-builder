import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Form Builder</h1>
        <p className="mb-6">Create and manage your forms with ease.</p>
        <div className="space-x-4">
          <Link href="/auth/register">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Register
            </button>
          </Link>
          <span>or</span>
          <Link href="/auth/login">
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Login
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
