'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../lib/axios';

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formsResponse = await api.get('/api/forms');
        const foldersResponse = await api.get('/api/folders');
        setForms(formsResponse.data.forms || []);
        console.log(formsResponse);
        setFolders(foldersResponse.data.folders || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="flex flex-col items-center w-screen h-screen bg-gray-100 p-6">
      <div className="w-full max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Dashboard</h1>
          <div className="flex justify-center space-x-4">
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
        </header>

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
                <p className="text-gray-600">Details about {form.formName}...</p>
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
                <p className="text-gray-600">Details about {folder.folderName}...</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
