import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex items-center justify-center w-screen h-screen bg-gradient-to-r from-blue-400 to-teal-500">
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-lg w-full">
        <h1 className="text-5xl font-extrabold mb-6 text-gray-800">
          Welcome to Form Builder
        </h1>
        <p className="text-lg mb-8 text-gray-600 leading-relaxed">
          Create and manage your forms effortlessly with our intuitive platform. Get started today!
        </p>
        <div className="flex flex-col items-stretch space-y-4">
          <Link href="/auth/register">
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105">
              Register
            </button>
          </Link>
          <div className="flex justify-center">
            <p className="text-gray-500">or</p>
          </div>
          <Link href="/auth/login">
            <button className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-transform transform hover:scale-105">
              Login
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
