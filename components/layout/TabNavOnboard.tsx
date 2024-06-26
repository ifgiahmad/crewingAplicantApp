"use client";
import { useState } from "react";
import CrewRekrutmen from "@/app/models/CrewRekrutmen";
import FormDataDiri from "@/components/form/form-data-diri";
import FormPendidikan from "@/components/form/form-pendidikan";
import FormSertifikat from "../form/form-sertifikasi";
import FormRiwayatPekerjaan from "../form/form-riwayat-pekerjaan";
import FormFilePendukung from "../form/form-file-pendukung";

interface TabNavOnboard {
  id: number;
}

const TabNavOnboard: React.FC<TabNavOnboard> = ({ id }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [rekrutmenId, setRekrutmenId] = useState<number>(id);
  const [position, setPosition] = useState<string>("");
  const [disableTab, setDisableTab] = useState<boolean>(true);

  const handleNext = (rekId: number) => {
    setRekrutmenId(rekId);
    setActiveTab((prevTab) => prevTab + 1);
    if (activeTab === 1) {
      setDisableTab(true);
    } else {
      setDisableTab(false);
    }
  };

  const handlePrevious = (rekId: number) => {
    setRekrutmenId(rekId);
    setActiveTab((prevTab) => prevTab - 1);
    if (activeTab === 1) {
      id = rekId;
      setDisableTab(true);
    } else {
      setDisableTab(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:items-center mt-2">
      <div className="bg-white shadow-md rounded-lg flex flex-wrap justify-center md:flex-nowrap">
        <button
          onClick={() => {
            setActiveTab(0);
            setDisableTab(true);
          }}
          className={`py-2 px-4 ${
            activeTab === 0
              ? "text-white bg-green-800"
              : "text-green-800 hover:bg-green-300"
          } rounded-lg mx-1 my-1 ${
            activeTab === 0 ? "border-b-2 border-green-800" : ""
          }`}
        >
          Data Diri
        </button>
        <button
          onClick={() => {
            setActiveTab(1);
            setDisableTab(false);
          }}
          className={`py-2 px-4 ${
            activeTab === 1
              ? "text-white bg-green-800"
              : "text-green-800 hover:bg-green-300"
          } rounded-lg mx-1 my-1 ${
            activeTab === 1 ? "border-b-2 border-green-800" : ""
          }`}
          disabled={disableTab}
        >
          Pendidikan
        </button>
        <button
          onClick={() => {
            setActiveTab(2);
            setDisableTab(false);
          }}
          className={`py-2 px-4 ${
            activeTab === 2
              ? "text-white bg-green-800"
              : "text-green-800 hover:bg-green-300"
          } rounded-lg mx-1 my-1 ${
            activeTab === 2 ? "border-b-2 border-green-800" : ""
          }`}
          disabled={disableTab}
        >
          Sertifikasi
        </button>
        <button
          onClick={() => {
            setActiveTab(3);
            setDisableTab(false);
          }}
          className={`py-2 px-4 ${
            activeTab === 3
              ? "text-white bg-green-800"
              : "text-green-800 hover:bg-green-300"
          } rounded-lg mx-1 my-1 ${
            activeTab === 3 ? "border-b-2 border-green-800" : ""
          }`}
          disabled={disableTab}
        >
          Riwayat Pekerjaan
        </button>
        <button
          onClick={() => {
            setActiveTab(4);
            setDisableTab(false);
          }}
          className={`py-2 px-4 ${
            activeTab === 4
              ? "text-white bg-green-800"
              : "text-green-800 hover:bg-green-300"
          } rounded-lg mx-1 my-1 ${
            activeTab === 4 ? "border-b-2 border-green-800" : ""
          }`}
          disabled={disableTab}
        >
          File Pendukung
        </button>
      </div>

      <div>
        {activeTab === 0 && (
          <FormDataDiri
            onNext={handleNext}
            rekrutmenId={id === 0 ? rekrutmenId : id}
          />
        )}
        {activeTab === 1 /*  && rekrutmenId > 0 */ && (
          <>
            <FormPendidikan
              onNext={handleNext}
              onPrevious={handlePrevious}
              rekrutmenId={rekrutmenId!}
            />
          </>
        )}
        {activeTab === 2 && (
          <>
            <FormSertifikat
              onNext={handleNext}
              onPrevious={handlePrevious}
              rekrutmenId={rekrutmenId!}
            />
          </>
        )}
        {activeTab === 3 && (
          <>
            <FormRiwayatPekerjaan
              onNext={handleNext}
              onPrevious={handlePrevious}
              rekrutmenId={rekrutmenId!}
            />
          </>
        )}
        {activeTab === 4 && (
          <>
            <FormFilePendukung
              onNext={handleNext}
              onPrevious={handlePrevious}
              rekrutmenId={rekrutmenId!}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TabNavOnboard;
