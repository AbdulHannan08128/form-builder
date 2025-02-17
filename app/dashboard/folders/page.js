'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import api from '@/app/lib/axios';

export default function Dashboard() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foldersResponse = await api.get('/api/folders');
        setFolders(foldersResponse.data.folders || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch user details from cookies
    setUserName(Cookies.get('user_name') || '');
    setUserEmail(Cookies.get('user_email') || '');

    fetchData();
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user_email');
    Cookies.remove('user_name');
    window.location.href = '/auth/login'; // Redirect to the login page
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <main className="flex flex-col items-center w-screen min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 md:p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Folders</h1>
            <p className="text-gray-600">Welcome, <span className="font-semibold">{userName}</span></p>
            <p className="text-gray-500">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Logout
          </button>
        </header>

        {/* Add Folder Button */}
        <div className="flex justify-center mb-8">
          <Link href="/dashboard/create-folder" className="w-full md:w-1/2">
            <div className="bg-green-600 text-white rounded-lg shadow-lg cursor-pointer hover:bg-green-700 transition-colors duration-200 py-4 text-center">
              <span className="text-lg font-semibold">Add Folder</span>
            </div>
          </Link>
        </div>

        {/* Folders Content */}
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-700">Loading...</span>
          </div>
        ) : (
          <div>
            {/* Folders Section */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Folders</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {folders.slice(0, 4).map((folder) => (
                  <div key={folder.id} className="bg-white p-4 md:p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{folder.folderName}</h3>
                    <p className="text-gray-600 text-sm">Created on: {formatDate(folder.createdAt)}</p>
                    <p className="text-gray-600 text-sm">{folder.description}</p>
                    <div className="mt-4 text-green-600 text-sm">
                      <Link href={`/dashboard/folders/inspect/${folder.folderId}`} className="hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Back to Dashboard Link */}
            <div className="flex justify-center mb-8">
              <Link href="/dashboard" className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
