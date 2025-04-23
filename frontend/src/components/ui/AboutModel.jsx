import React from 'react';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">About This Website</h2>
        <p className="mb-4">
          Our website is a learning tool for students studying image and video processing using machine learning.
          You can test your models' outputs against reference implementations or explore what different methods
          do to an image when applied.
        </p>
        <p className="mb-4">
          This platform provides all essential image processing methods under one roof, making it easier to
          compare techniques and understand their effects visually.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AboutModal;