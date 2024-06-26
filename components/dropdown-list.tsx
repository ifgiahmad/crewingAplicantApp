// components/JabatanDropdown.tsx
"use client";
import React, { useEffect, useState } from "react";
import KodeMaster from "@/app/models/KodeMaster";
import api from "@/app/lib/api";

interface DropdownProps {
  elementId: string;
  labelName: string;
}

const Dropdown: React.FC<DropdownProps> = ({ elementId, labelName }) => {
  const [positions, setPositions] = useState<KodeMaster[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>("");

  useEffect(() => {
    //const apiUrl = "https://localhost:7299/api/onboard/masterbytype?type=CREW_LVL"; // Ganti dengan URL API Anda

    const fetchPositions = async () => {
      try {
        //const response = await fetch(apiUrl);
        const data = await api.getMasterByTypeNonAuth("CREW_LVL");
        const positions = data.map(
          (item: any) =>
            new KodeMaster(
              item.id,
              item.kodeMaster,
              item.tipeMaster,
              item.textMaster,
              item.urutan,
              item.createdBy,
              item.createdTime,
              item.modifiedBy,
              item.modifiedTime,
              item.aktif
            )
        );
        setPositions(positions);
        console.log()
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchPositions();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPosition(event.target.value);
  };

  return (
    <div>
      <label
        htmlFor={elementId}
        className="block text-xs font-small text-gray-900 mb-1"
      >
        <sup>* </sup>
        {labelName}
      </label>
      <select
        id={elementId}
        name={elementId}
        value={selectedPosition || ""}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 rounded"
      >
        <option value=""> --Pilih {labelName} --</option>
        {positions.map((position) => (
          <option key={position.id} value={position.textMaster}>
            {position.textMaster}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
