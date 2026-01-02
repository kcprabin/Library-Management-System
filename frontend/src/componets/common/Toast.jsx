import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
 }, [duration, onClose]);

 const icons = {
     success: <FaCheckCircle className="w-6 h-6 text-green-500" />,
    error: <FaExclamationCircle className="w-6 h-6 text-red-500" />,
    info: <FaInfoCircle className="w-6 h-6 text-blue-500" />
 };
   const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };
  return (
    <div className={`fixed top-4 right-4 z-[9999] animate-slide-in ${bgColors[type]} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md`}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <p className="flex-1 text-sm text-gray-800">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FaTimes />
        </button>
      </div>
    </div>
  );
}

export default Toast
