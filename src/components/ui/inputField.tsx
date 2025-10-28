import type { InputFieldProps } from "@/types";

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  onKeyPress,
  placeholder,
  icon,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};


export default InputField;