'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique IDs

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
        const response = await api.post('/api/form/', { ID });
        const { form } = response.data;
        setFormName(form.formName);
        setFields(form.fields.map(field => ({ ...field, id: field.id || uuidv4() }))); // Ensure unique IDs
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
    setFields(prevFields => [
      ...prevFields,
      { id: uuidv4(), type: 'text', label: '', options: [], defaultOption: '' }
    ]);
  };

  const handleFieldChange = (id, key, value) => {
    setFields(prevFields =>
      prevFields.map(field =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const handleAddOption = (id) => {
    setFields(prevFields =>
      prevFields.map(field =>
        field.id === id ? { ...field, options: [...field.options, ''] } : field
      )
    );
  };

  const handleOptionChange = (id, index, value) => {
    setFields(prevFields =>
      prevFields.map(field =>
        field.id === id
          ? {
              ...field,
              options: field.options.map((option, i) => (i === index ? value : option))
            }
          : field
      )
    );
  };

  const handleRemoveOption = (id, index) => {
    setFields(prevFields =>
      prevFields.map(field =>
        field.id === id
          ? {
              ...field,
              options: field.options.filter((_, i) => i !== index)
            }
          : field
      )
    );
  };

  const handleRemoveField = (id) => {
    setFields(prevFields => prevFields.filter(field => field.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      formName,
      fields,
    };

    try {
      const response = await api.put('/api/forms', { id: ID, ...updatedFormData });
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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8 px-4">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Update Form</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Name</label>
            <input
              type="text"
              value={formName}
              onChange={handleFormNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Form Fields</h2>
            {fields.map((field) => (
              <div key={field.id} className="bg-gray-50 p-4 rounded-md shadow-sm mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
                  <select
                    value={field.type}
                    onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    className="mt-2 sm:mt-0 flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  <div className="space-y-4 mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Options</h3>
                    {field.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(field.id, index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddField}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add New Field
            </button>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <Link href="/dashboard">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Form
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
