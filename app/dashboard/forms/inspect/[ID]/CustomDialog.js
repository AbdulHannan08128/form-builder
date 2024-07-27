// components/CustomDialog.js
import React from 'react';

const CustomDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm mx-4 w-full">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">{title}</h2>
                    <p className="mb-6">{message}</p>
                    <div className="flex justify-end gap-4">
                        <button 
                            onClick={onClose} 
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 ease-in-out"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onConfirm} 
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ease-in-out"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomDialog;
