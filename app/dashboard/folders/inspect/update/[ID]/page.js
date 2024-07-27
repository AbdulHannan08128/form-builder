'use client';

import React, { useState, useEffect } from 'react';
import CustomSelect from './Custumselect'; // Ensure correct path
import api from '@/app/lib/axios'; // Ensure correct path

const UpdateFolder = ({ params }) => {
  const [folderName, setFolderName] = useState('');
  const [selectedForms, setSelectedForms] = useState([]);
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { ID } = params; // Folder ID from params

  useEffect(() => {
    const fetchData = async () => {
      try {
        const folderResponse = await api.post('/api/folder', { ID });
        const formsResponse = await api.get('/api/forms'); // Ensure this endpoint returns all forms

        if (folderResponse.status === 200 && formsResponse.status === 200) {
          const { folder } = folderResponse.data;
          const { forms: allForms = [] } = formsResponse.data;

          if (folder) {
            const { folderName, forms: selectedFormsData = [] } = folder;

            // Extract form options and selected forms
            const formOptions = allForms.map((form) => ({
              value: form._id || '',
              label: form.formName || 'Unknown Form',
            }));

            // Determine selected forms
            const selectedFormIds = selectedFormsData.map(form => form._id || '');
            setSelectedForms(selectedFormIds);

            // Set folder name and forms
            setFolderName(folderName);
            setForms(formOptions);
          } else {
            setError('Folder data is missing.');
          }
        } else {
          setError('Failed to fetch folder data or forms.');
        }
      } catch (error) {
        setError('Error fetching folder data or forms.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ID]);

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleFormSelection = (selectedValues) => {
    setSelectedForms(selectedValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const folderData = {
      id: ID, // Include ID for PUT request
      folderName,
      forms: selectedForms,
    };

    try {
      const response = await api.put(`/api/folders/`, folderData);

      if (response.status === 200 && response.data.folder) {
        window.location.href = '/dashboard'; // Redirect to dashboard on success
      } else {
        setError(response.data.message || 'Update failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-3xl">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Update Folder</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
            <input
              type="text"
              value={folderName}
              onChange={handleFolderNameChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter folder name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Forms</label>
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
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Update Folder
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default UpdateFolder;
