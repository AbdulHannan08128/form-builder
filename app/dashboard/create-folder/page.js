'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CustomSelect from './Custumselect'; // Ensure correct path
import api from '@/app/lib/axios'; // Ensure correct path

export default function CreateFolder() {
  const [folderName, setFolderName] = useState('');
  const [selectedForms, setSelectedForms] = useState([]);
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await api.get('/api/forms');
        if (response.status === 200) {
          const formOptions = response.data.forms.map((form) => ({
            value: form._id,
            label: form.formName,
          }));
          setForms(formOptions);
        } else {
          console.error('Failed to fetch forms');
        }
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, []);

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleFormSelection = (selectedValues) => {
    setSelectedForms(selectedValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const folderData = {
      folderName,
      selectedForms,
    };

    // Log the data to the console
    console.log('Folder Data:', folderData);

    // Example: Send the data to the server
    try {
      const response = await api.post('/api/folders', folderData);

      if (response.status === 200 && response.data.folder) {
        window.location.href = '/dashboard';
      } else {
        // Handle specific error messages from the backend
        setError(response.data.message || 'Creation failed. Please try again.');
      }
    } catch (err) {
      console.error('Error creating folder:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen bg-gray-200 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Create New Folder</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Folder Name</label>
            <input
              type="text"
              value={folderName}
              onChange={handleFolderNameChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter folder name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Forms</label>
            <CustomSelect
              options={forms}
              selected={selectedForms}
              onChange={handleFormSelection}
              isMulti
            />
            <p className="text-gray-500 text-xs mt-1">Hold down the Ctrl (or Command) key to select multiple options.</p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Create Folder
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link href="/dashboard">
            <span className="text-blue-500 hover:underline text-sm">Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
