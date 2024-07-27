'use client'
import React, { useEffect, useState } from 'react';
import api from '@/app/lib/axios';
import { exportToExcel, exportToPDF } from '@/app/lib/exportUtils'; // Make sure to create these utility functions

const Submissions = ({ params }) => {
    const [formData, setFormData] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const ID = params.ID;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.post('/api/submissions', { ID });
                setFormData(response.data.form);
                setSubmissions(response.data.submissions);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ID]);

    const sortedSubmissions = submissions.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (loading) return <div className="text-center py-4">Loading submissions...</div>;
    if (error) return <div className="text-center text-red-600 py-4">Error: {error.message}</div>;

    if (!formData) return <div className="text-center py-4">Form data not found.</div>;

    const headers = formData.fields.map(field => field.label);
    const labelToKeyMap = formData.fields.reduce((acc, field) => {
        acc[field.label] = field.label.replace(/ /g, '_');
        return acc;
    }, {});

    return (
        <div className="container mx-auto px-4 py-8 lg:max-w-[80vw]">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Submissions</h1>
                <h2 className="text-2xl font-semibold text-gray-700">{formData.formName}</h2>
            </header>
            
            <div className="flex flex-wrap gap-2 mb-4">
                <button 
                    onClick={() => exportToExcel(submissions, headers)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                >
                    Export to Excel
                </button>
                <button 
                    onClick={() => exportToPDF(submissions, headers)} 
                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
                >
                    Export to PDF
                </button>
            </div>

            {submissions.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-gray-500">No submissions found.</p>
                </div>
            ) : (
                <div className="relative overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Submission Time</th>
                                {headers.map((header, idx) => (
                                    <th key={idx} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedSubmissions.map(submission => (
                                <tr key={submission._id}>
                                    <td className="px-4 py-4 text-sm text-gray-900">{new Date(submission.createdAt).toLocaleString()}</td>
                                    {headers.map(header => (
                                        <td key={header} className="px-4 py-4 text-sm text-gray-700">
                                            {submission.responses[labelToKeyMap[header]] || 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Submissions;
