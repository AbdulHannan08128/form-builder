'use client';
import React, { useEffect, useState } from 'react';
import api from '@/app/lib/axios'; // Assuming api is correctly configured Axios instance
import Link from 'next/link';
import CustomDialog from './CustomDialog'; // Import the CustomDialog component

const Page = ({ params }) => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        setIsDialogOpen(false); // Close the dialog before starting deletion

        try {
            const response = await api.delete('/api/forms', { data: { id: ID } });
            if (response.data.status === 200) {
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error("Failed to delete the form:", error);
        }
    };

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-4">Error: {error.message}</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h1 className="text-3xl font-extrabold mb-6 text-gray-800">{formData.formName}</h1>
                <div className="space-y-6">
                    {formData.fields.map((field) => (
                        <div key={field._id} className="p-4 bg-gray-100 border rounded-lg shadow-md">
                            <div className="mb-2">
                                <span className="font-semibold text-gray-700">Label:</span> {field.label}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold text-gray-700">Type:</span> {field.type}
                            </div>
                            {field.options && field.options.length > 0 && (
                                <div>
                                    <span className="font-semibold text-gray-700">Options:</span>
                                    <ul className="list-disc list-inside pl-4 mt-2">
                                        {field.options.map((option, idx) => (
                                            <li key={idx} className="text-gray-600">{option}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    <Link href={`/dashboard/forms/inspect/update/${formData.formId}`} passHref>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out">Edit</button>
                    </Link>
                    <button
                        className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ease-in-out"
                        onClick={() => setIsDialogOpen(true)} // Open the dialog on click
                    >
                        Delete
                    </button>
                    <Link href={`/dashboard/forms/inspect/submissions/${formData.formId}`} passHref>
                        <button className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out">View Submissions</button>
                    </Link>
                </div>
            </div>

            {/* Custom Dialog Component */}
            <CustomDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={deleteForm}
                title="Confirm Deletion"
                message="Are you sure you want to delete this form permanently?"
            />
        </div>
    );
}

export default Page;
