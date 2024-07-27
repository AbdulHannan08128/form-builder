'use client'
import React, { useEffect, useState } from 'react';
import api from '@/app/lib/axios'; // Assuming api is correctly configured Axios instance

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
                console.log(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ID]);

    // Sort submissions by submission time in descending order
    const sortedSubmissions = submissions.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (loading) return <div className="text-center py-4">Loading submissions...</div>;
    if (error) return <div className="text-center text-red-500 py-4">Error: {error.message}</div>;

    if (!formData) return <div className="text-center py-4">Form data not found.</div>;

    // Extract field labels and create a mapping of labels to field keys
    const headers = formData.fields.map(field => field.label);

    // Create a map from field labels to form responses keys
    const labelToKeyMap = formData.fields.reduce((acc, field) => {
        acc[field.label] = field.label.replace(/ /g, '_'); // Replace spaces with underscores for consistency
        return acc;
    }, {});

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Submissions</h1>
            <h1 className="text-3xl font-bold mb-4">{formData.formName}</h1>
            {submissions.length === 0 ? (
                <div className="text-center py-4">No submissions found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="py-2 px-4 text-left text-gray-600">Submission Time</th>
                                {headers.map((header, idx) => (
                                    <th key={idx} className="py-2 px-4 text-left text-gray-600">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedSubmissions.map(submission => (
                                <tr key={submission._id} className="border-b border-gray-200">
                                    <td className="py-2 px-4">{new Date(submission.createdAt).toLocaleString()}</td>
                                    {headers.map(header => (
                                        <td key={header} className="py-2 px-4">
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
