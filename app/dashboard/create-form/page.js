'use client'
import { useState } from 'react';
import Link from 'next/link';

const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'password', label: 'Password' },
    { value: 'tel', label: 'Telephone' },
    { value: 'url', label: 'URL' },
    { value: 'date', label: 'Date' },
    { value: 'time', label: 'Time' },
    { value: 'datetime-local', label: 'Date and Time' },
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'range', label: 'Range' },
    { value: 'color', label: 'Color' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio' },
    { value: 'select', label: 'Select' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'file', label: 'File' },
    { value: 'hidden', label: 'Hidden' },
  ];
  

export default function CreateForm() {
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState([]);

  const handleFormNameChange = (e) => {
    setFormName(e.target.value);
  };

  const handleAddField = () => {
    setFields([
      ...fields,
      { id: Date.now(), type: 'text', label: '' }
    ]);
  };

  const handleFieldChange = (id, key, value) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, such as sending form data to the server
    console.log({ formName, fields });
  };

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Form</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Form Name</label>
            <input
              type="text"
              value={formName}
              onChange={handleFormNameChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Form Fields</h2>
            {fields.map((field) => (
              <div key={field.id} className="flex items-center space-x-4 mb-4">
                <select
                  value={field.type}
                  onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {fieldTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Field Label"
                  value={field.label}
                  onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField(field.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddField}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Field
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Create Form
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link href="/dashboard">
            <span className="text-blue-500 hover:underline cursor-pointer">Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
