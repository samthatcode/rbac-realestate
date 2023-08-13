import React from "react";

const MessageModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm overlay">
      <div className="bg-slate-100 rounded-md shadow-lg p-6 w-full max-w-md text-center mx-4">
        <h1 className="text-3xl text-green-500 mb-4">Success!!</h1>
        <p className="text-gray-800 mb-10">{message}</p>
        <button
          className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 focus:outline-none"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
