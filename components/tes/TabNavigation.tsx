import React, { useState } from "react";
import DataDiriForm from "./DataDiriForm";
import PendidikanTable from "./PendidikanTable";
import SubmitForm from "./SubmitForm";

const TabNavigation: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [dataDiri, setDataDiri] = useState(null);

  const handleNext = (data?: any) => {
    if (currentTab === 0 && data) {
      setDataDiri(data);
      // Simpan data diri ke database dan dapatkan ID
      const id = 1; // Ganti dengan ID yang didapat dari database
    }
    setCurrentTab(currentTab + 1);
  };

  const handlePrev = () => {
    setCurrentTab(currentTab - 1);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setCurrentTab(0)}
          className={`px-4 py-2 ${
            currentTab === 0 ? "bg-blue-500 text-white" : ""
          }`}
        >
          Data Diri
        </button>
        <button
          onClick={() => setCurrentTab(1)}
          className={`px-4 py-2 ${
            currentTab === 1 ? "bg-blue-500 text-white" : ""
          }`}
        >
          Pendidikan
        </button>
        <button
          onClick={() => setCurrentTab(2)}
          className={`px-4 py-2 ${
            currentTab === 2 ? "bg-blue-500 text-white" : ""
          }`}
        >
          Submit
        </button>
      </div>

      {currentTab === 0 && <DataDiriForm onNext={handleNext} />}
      {currentTab === 1 && (
        <PendidikanTable onNext={handleNext} onPrev={handlePrev} />
      )}
      {currentTab === 2 && <SubmitForm onPrev={handlePrev} />}
    </div>
  );
};

export default TabNavigation;
