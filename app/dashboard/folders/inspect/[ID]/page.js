'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/app/lib/axios';
import CustomDialog from './CustumDialog'; // Make sure the path is correct
 
const Page = ({ params }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const ID = params.ID;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.post('/api/folder', { ID });
                setData(response.data.folder); // Assuming the response data is what you need
                console.log(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ID]);

    const deleteFolder = async () => {
        setIsDialogOpen(false); // Close the dialog before starting deletion
    
        try {
            const response = await api.delete('/api/folders', { data: { ID } });
            if (response.data.status === 200) {
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error("Failed to delete the folder:", error);
        }
    };
    

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center text-red-600 py-4">Error: {error.message}</div>;

    if (!data) return <div className="text-center py-4">No data found.</div>;

    return (
        <div className="container mx-auto px-4 py-8 lg:max-w-[80vw]">
            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                <header className="mb-6">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Folder Details</h1>
                </header>
                <section className="mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-2">Folder Name: {data.folderName}</h2>
                    <p className="text-lg text-gray-600">Number of Forms: {data.forms?.length || 0}</p>
                </section>

                {data.forms && data.forms.length > 0 ? (
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.forms.map((form, index) => (
                            <div key={index} className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">{form.formName}</h3>
                                    <p className="text-md mb-4">{form?.fields?.length} Fields</p>
                                    <Link
                                        className="inline-block bg-white text-indigo-500 hover:text-indigo-600 font-medium px-4 py-2 rounded-lg border border-white transition duration-300"
                                        href={'/dashboard/forms/inspect/' + form.formId}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </section>
                ) : (
                    <p className="text-center text-gray-600 mt-4">No forms available.</p>
                )}

                <footer className="mt-8 flex space-x-4">
                    <Link href={`/dashboard/folders/inspect/update/${data.folderId}`}>
                    <button 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                    >
                        Edit Folder
                    </button>
                    </Link>
                    <button 
                        className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
                        onClick={() => setIsDialogOpen(true)} // Open the dialog on click
                    >
                        Delete Folder
                    </button>
                </footer>
            </div>

            {/* Custom Dialog Component */}
            <CustomDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={deleteFolder}
                title="Confirm Deletion"
                message="Are you sure you want to delete this folder permanently?"
            />
        </div>
    );

   
}

export default Page;
