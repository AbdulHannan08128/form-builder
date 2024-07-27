'use client';

import { useState, useEffect } from 'react';
import api from '@/app/lib/axios';

const FIELD_TYPES = [
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

export default function DynamicForm({ params }) {
  const [formData, setFormData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const ID = params.ID;

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await api.post('/api/form/', { ID });
        const form = response.data.form;

        // Set default values for the form fields
        const initialFormValues = {};
        form.fields.forEach((field) => {
          const fieldKey = field.label.replace(/\s+/g, '_');
          initialFormValues[fieldKey] = field.defaultOption || '';
        });
        setFormValues(initialFormValues);
        setFormData(form);
      } catch (err) {
        setError('Error fetching form data');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [ID]);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'file' ? files : type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim spaces from the keys
    const trimmedFormValues = Object.keys(formValues).reduce((acc, key) => {
      const trimmedKey = key.trim();
      acc[trimmedKey] = formValues[key];
      return acc;
    }, {});

    try {
      setLoading(true);
      setError(null);

      const payload = {
        formId: ID,
        responses: trimmedFormValues
      };

      const response = await api.post('/api/form/submit', payload);

      if (response.data.status === 201) {
        setSubmitted(true);
      } else {
        setError('Error submitting form');
      }
    } catch (err) {
      setError('Error submitting form');
    } finally {
      setLoading(false);
    }

    console.log('Form values:', trimmedFormValues);
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  if (submitted) {
    return <div className="text-center text-green-600">Form submitted successfully!</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 max-w-lg w-full bg-white rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">{formData.formName}</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {formData.fields.map((field) => {
            const { type, label, options, _id } = field;
            const fieldKey = label.replace(/\s+/g, '_');
            return (
              <div key={_id.$oid} className="flex flex-col">
                <label className="mb-3 text-lg font-medium text-gray-800">{label}</label>
                {type === 'select' ? (
                  <select
                    name={fieldKey}
                    value={formValues[fieldKey]}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : type === 'textarea' ? (
                  <textarea
                    name={fieldKey}
                    value={formValues[fieldKey]}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="5"
                  />
                ) : type === 'checkbox' || type === 'radio' ? (
                  options.map((option, index) => (
                    <label key={index} className="inline-flex items-center space-x-3">
                      <input
                        type={type}
                        name={fieldKey}
                        value={option}
                        checked={formValues[fieldKey] === option}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))
                ) : type === 'file' ? (
                  <input
                    type={type}
                    name={fieldKey}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <input
                    type={type}
                    name={fieldKey}
                    value={formValues[fieldKey]}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            );
          })}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-4 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
