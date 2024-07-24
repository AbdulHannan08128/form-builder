'use client'
import { useState } from 'react';
import Link from 'next/link';
import CustomSelect from './Custumselect';

// Mock data for forms, replace with actual data from your backend or state
const mockForms = [
  { value: 1, label: 'Form 1' },
  { value: 2, label: 'Form 2' },
  { value: 3, label: 'Form 3' },
  { value: 4, label: 'Form 4' },
];

export default function CreateFolder() {
  const [folderName, setFolderName] = useState('');
  const [selectedForms, setSelectedForms] = useState([]);

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleFormSelection = (value) => {
    setSelectedForms(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle folder creation logic here, such as sending data to the server
    console.log({ folderName, selectedForms });
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
              options={mockForms}
              selected={selectedForms}
              onChange={handleFormSelection}
            />
            <p className="text-gray-500 text-xs mt-1">Hold down the Ctrl (or Command) key to select multiple options.</p>
          </div>

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
