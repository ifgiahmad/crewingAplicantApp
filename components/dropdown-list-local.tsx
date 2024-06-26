// components/JabatanDropdown.tsx
"use client";
import React, { useEffect, useState } from "react";

//Parameter yg dikirim dari depan harus di declare disini
interface DropdownProps {
  elementId: string;
  elementValue: string;
  labelValue: string;
}
interface Option {
  value: string;
  label: string;
}

const DropdownLocal: React.FC<DropdownProps> = ({
  elementId,
  elementValue,
  labelValue,
}) => {
  const [selectedDropdown, setSelectedDropdown] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDropdown(event.target.value);
  };

  const options: { [key: string]: Option[] } = {
    JenisKelamin: [
      { value: "LAKI-LAKI", label: "LAKI-LAKI" },
      { value: "PEREMPUAN", label: "PEREMPUAN" },
    ],
    b: [
      { value: "b1", label: "Option B1" },
      { value: "b2", label: "Option B2" },
    ],
    c: [
      { value: "c1", label: "Option C1" },
      { value: "c2", label: "Option C2" },
    ],
  };

  return (
    <div>
      <label
        htmlFor={elementId}
        className="block text-xs font-small text-gray-900 mb-1"
      >
        <sup>* </sup>
        {labelValue}
      </label>
      <select
        name={elementId}
        id={elementId}
        value={selectedDropdown}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 rounded"
        required
      >
        <option value="">{labelValue}</option>
        {options[elementId].map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownLocal;
