'use client'
import React, { useEffect, useState } from 'react';
import api from '@/app/lib/axios'; // Assuming api is correctly configured Axios instance
import Link from 'next/link';

const Page = ({ params }) => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const ID = params.ID;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.post('/api/form', { ID });
                setFormData(response.data.form);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ID]);

    const deleteForm = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this form permanently?");

        if (confirmDelete) {
            try {
                const response = await api.delete('/api/forms', { data: { id: ID } });
                if (response.data.status === 200) {
                    window.location.href = '/dashboard';
                }
            } catch (error) {
                console.error("Failed to delete the form:", error);
            }
        }
    };

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-4">Error: {error.message}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{formData.formName}</h1>
            <div className="space-y-4">
                {formData.fields.map((field) => (
                    <div key={field._id} className="p-4 border rounded shadow-sm">
                        <div className="mb-2">
                            <span className="font-semibold">Label:</span> {field.label}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Type:</span> {field.type}
                        </div>
                        {field.options && field.options.length > 0 && (
                            <div>
                                <span className="font-semibold">Options:</span>
                                <ul className="list-disc list-inside pl-4">
                                    {field.options.map((option, idx) => (
                                        <li key={idx}>{option}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-6 flex space-x-4">
                <Link href={`/dashboard/forms/inspect/update/${formData.formId}`}>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                </Link>
                
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={deleteForm}>Delete</button>
                
                <Link href={`/dashboard/forms/inspect/submissions/${formData.formId}`}>
                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">View Submissions</button>
                </Link>
            </div>
        </div>
    );
}

export default Page;
