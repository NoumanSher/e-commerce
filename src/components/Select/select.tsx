// components/Select.tsx
import React from "react";

interface SelectProps {
  label: string;
  options: string[]; // Options for the select component
  selectedOption: string;
  className:string
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>; // State setter for the selected option
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  selectedOption,
  setSelectedOption,
  className
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-gray-700 font-medium">{label}</label>
      <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        className="px-3 py-2 h-12 border border-gray-300  focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
