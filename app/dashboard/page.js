'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import api from '../lib/axios';

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formsResponse = await api.get('/api/forms');
        const foldersResponse = await api.get('/api/folders');
        setForms(formsResponse.data.forms || []);
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
    return <div>Error: {error}</div>;
  }

  return (
    <main className="flex flex-col items-center w-screen h-screen bg-gray-100 p-6">
      <div className="w-full max-w-6xl">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Dashboard</h1>
              <p className="text-gray-700">Welcome, <span className="font-semibold">{userName}</span></p>
              <p className="text-gray-500">{userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex justify-center space-x-4 mb-8">
          <Link href="/dashboard/create-form">
            <div className="py-3 px-6 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center">
              <span className="block text-lg font-semibold">Add Form</span>
            </div>
          </Link>
          <Link href="/dashboard/create-folder">
            <div className="py-3 px-6 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-center">
              <span className="block text-lg font-semibold">Add Folder</span>
            </div>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-700">Loading...</span>
          </div>
        ) : (
          <div>
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">Forms</h2>
                {forms.length >= 4 && (
                  <Link href="/dashboard/forms">
                    <div className="text-blue-500 hover:underline cursor-pointer text-sm">
                      View More
                    </div>
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {forms.slice(0, 4).map((form) => (
                  <div key={form.id} className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                    <h3 className="text-xl font-semibold mb-2">{form.formName}</h3>
                    <p className="text-gray-600">Created on: {formatDate(form.createdAt)}</p>
                    <p className="text-gray-600">{form.description}</p>
                    <Link href={`/dashboard/forms/${form.id}`}>
                      <div className="mt-4 text-blue-500 hover:underline cursor-pointer">
                        View Details
                      </div>
                    </Link>
                    <Link href={`/form/${form.formId}`}>
                      <div className="mt-2 text-blue-500 hover:underline cursor-pointer">
                        Live Form
                      </div>
                    </Link>
                    
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">Folders</h2>
                {folders.length >= 4 && (
                  <Link href="/dashboard/folders">
                    <div className="text-green-500 hover:underline cursor-pointer text-sm">
                      View More
                    </div>
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {folders.slice(0, 4).map((folder) => (
                  <div key={folder.id} className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                    <h3 className="text-xl font-semibold mb-2">{folder.folderName}</h3>
                    <p className="text-gray-600">Created on: {formatDate(folder.createdAt)}</p>
                    <p className="text-gray-600">{folder.description}</p>
                    <Link href={`/dashboard/folders/${folder.id}`}>
                      <div className="mt-4 text-green-500 hover:underline cursor-pointer">
                        View Details
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
