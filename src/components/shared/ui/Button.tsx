import React from 'react';

const Button: React.FC<{
  onClick: () => void;
  isLoading: boolean;
  text: string;
}> = ({ onClick, isLoading, text }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;