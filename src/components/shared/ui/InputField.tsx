import React from "react";
import type { InputFieldProps } from "@/types";

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  onKeyPress,
  placeholder,
  icon,
  rightIcon,
  onRightIconClick,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          className={`w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition py-3 ${
            icon ? "pl-10" : "pl-4"
          } ${rightIcon ? "pr-10" : "pr-4"}`}
          placeholder={placeholder}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;