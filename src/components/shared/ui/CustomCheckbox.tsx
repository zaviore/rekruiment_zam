import React, { useId } from 'react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ 
  checked, 
  onChange, 
  className = '' 
}) => {
  const id = useId();
  
  return (
    <div className={`inline-flex ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
        id={id}
      />
      <label
        htmlFor={id}
        className={`
          w-5 h-5 rounded cursor-pointer flex items-center justify-center
          ${checked 
            ? 'bg-primary border border-primary' 
            : 'bg-white border border-primary'}
          transition-colors duration-200
        `}
      >
        {checked && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3.5 w-3.5 text-white" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
      </label>
    </div>
  );
};

export default CustomCheckbox;