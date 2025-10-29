import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ApplicationSubmittedProps {
  onClose?: () => void;
}

const ApplicationSubmitted: React.FC<ApplicationSubmittedProps> = ({ onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
      navigate('/dashboard');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate, onClose]);

 

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="max-w-2xl w-full p-6 text-center">
        <img 
          src="/src/assets/sent_application.svg" 
          alt="Application Sent" 
          className="mx-auto h-32 mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">🎉 Your application was sent!</h2>
        <p className="text-gray-600 mb-1 text-sm">Congratulations! You've taken the first step towards a rewarding career at Rakamin.</p>
        <p className="text-gray-600 text-sm mb-6">We look forward to learning more about you during the application process.</p>
        
      </div>
    </div>
  );
};

export default ApplicationSubmitted;