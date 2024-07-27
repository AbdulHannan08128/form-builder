'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
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

export default function UpdateForm({ params }) {
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const ID = params.ID;

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await api.post(`/api/form/`, { ID });
        const { form } = response.data;
        setFormName(form.formName);
        setFields(form.fields);
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Failed to load form data.');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [ID]);

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
    const updatedFormData = {
      formName,
      fields,
    };

    try {
      const response = await api.put(`/api/forms`, { id: ID, ...updatedFormData });
      if (response.status === 200 && response.data.form) {
        router.push('/dashboard');
      } else {
        setError(response.data.message || 'Update failed. Please try again.');
      }
    } catch (err) {
      console.error('Error updating form:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-2xl lg:max-w-3xl">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Update Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Form Fields</h2>
            {fields.map((field) => (
              <div key={field.id} className="flex flex-col space-y-4 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <select
                    value={field.type}
                    onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    className="mt-2 sm:mt-0 flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveField(field.id)}
                    className="mt-2 sm:mt-0 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
                {['select', 'radio', 'checkbox'].includes(field.type) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Options</h3>
                    {field.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(field.id, index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(field.id, index)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddOption(field.id)}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Add Option
                    </button>
                    {field.type !== 'select' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Default Option</label>
                        <select
                          value={field.defaultOption}
                          onChange={(e) => handleFieldChange(field.id, 'defaultOption', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Field
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Update Form
            </button>
          </div>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <Link href="/dashboard">
            <div className="text-blue-500 hover:underline cursor-pointer">
              Back to Dashboard
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
