'use client'
import { useState } from 'react';
import Link from 'next/link';
import api from '@/app/lib/axios';

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
  const [error, setError] = useState(null);

  const handleFormNameChange = (e) => {
    setFormName(e.target.value);
  };

  const handleAddField = () => {
    setFields([
      ...fields,
      { id: Date.now(), type: 'text', label: '', options: [], defaultOption: '' }
    ]);
  };

  const handleFieldChange = (id, key, value) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  const handleAddOption = (id) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, options: [...field.options, ''] } : field
    ));
  };

  const handleOptionChange = (id, index, value) => {
    setFields(fields.map(field =>
      field.id === id
        ? { ...field, options: field.options.map((option, i) => (i === index ? value : option)) }
        : field
    ));
  };

  const handleRemoveOption = (id, index) => {
    setFields(fields.map(field =>
      field.id === id
        ? { ...field, options: field.options.filter((_, i) => i !== index) }
        : field
    ));
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      formName,
      fields
    };

    try {
      const response = await api.post('/api/forms', formData);
      if (response.status === 200 && response.data.form) {
        window.location.href = '/dashboard';
      } else {
        setError(response.data.message || 'Creation failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Create a New Form</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
            <label className="block text-md font-medium text-gray-700 mb-2">Form Name</label>
            <input
              type="text"
              value={formName}
              onChange={handleFormNameChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Form Fields</h2>
            {fields.map((field) => (
              <div key={field.id} className="bg-white p-4 mb-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                  <select
                    value={field.type}
                    onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                    className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
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
                    className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveField(field.id)}
                    className="w-full sm:w-auto text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
                {['select', 'radio', 'checkbox'].includes(field.type) && (
                  <div className="mt-4 space-y-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Options</h3>
                    {field.options.map((option, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                        <input
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(field.id, index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(field.id, index)}
                          className="text-red-600 hover:text-red-800 focus:outline-none mt-2 sm:mt-0"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddOption(field.id)}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add Option
                    </button>
                    {field.type !== 'select' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Option</label>
                        <select
                          value={field.defaultOption}
                          onChange={(e) => handleFieldChange(field.id, 'defaultOption', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">None</option>
                          {field.options.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddField}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Field
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-center">{error}</div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Create Form
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link href="/dashboard">
            <div className="text-blue-600 hover:underline cursor-pointer">
              Back to Dashboard
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
