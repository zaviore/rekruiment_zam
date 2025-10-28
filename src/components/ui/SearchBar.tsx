import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search..." 
}) => {
  return (
    <div className="flex-1 relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#01959F]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-4 pr-10 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
};

export default SearchBar;