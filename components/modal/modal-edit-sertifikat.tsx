import { useState, useEffect } from "react";
import MsEmployeeCertificates from "@/app/models/MsEmployeeCertificate";
import api from "@/app/lib/api";
import { constant } from "@/app/lib/helper";
import { Toaster, toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropdownKodeMaster from "../dropdown-list-kode-master";
import { addYears } from "date-fns";
import ModalViewDokumen from "./modal-view-dokumen";
interface ModalEditSertifikatProps {
  relasiId: number;
  Id: number;
  typeDoc: string;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalEditSertifikat: React.FC<ModalEditSertifikatProps> = ({
  relasiId,
  Id,
  typeDoc,
  onClose,
  onSubmit,
}) => {
  const [sertifikat, setSertifikat] = useState<MsEmployeeCertificates>(
    new MsEmployeeCertificates()
  );
  // const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showInputIssuers, setShowInputIssuers] = useState<boolean>(false);
  const [showInputCertName, setShowInputCertName] = useState<boolean>(false);
  const [constantAPI, setConstantAPI] = useState<string>();
  const [yearsToAdd, setYearsToAdd] = useState(0);

  useEffect(() => {
    if (typeDoc === "Travel Document") {
      setShowInputIssuers(true);
      setConstantAPI(constant.MASTER_TYPE_TRAVEL_DOC);
    } else if (typeDoc === "Certificate Of Competency") {
      setConstantAPI(constant.MASTER_TYPE_CERTIFICATE_COMPETENCY_DOC);
    } else {
      setConstantAPI(constant.MASTER_TYPE_CERTIFICATE_PROFICIENCY_DOC);
    }
    if (Id > 0 && sertifikat.id === 0) {
      getDataById(Id);
    } else {
      sertifikat.rekrutmenId = relasiId;
    }
    async function getDataById(Id: number) {
      try {
        const data = await api.getDataByIdNonAuth(
          Id,
          constant.API_REKRUTMEN_GET_CERTIFICATE_ID_NON_AUTH
        );
        setSertifikat(data);
      } catch (err) {
        toast.error("Gagal mengambil data Sertifikat");
        console.error(err);
      }
    }
  }, [Id, sertifikat, relasiId, typeDoc]);

  const handleAddSertifikat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setSertifikat((prevUser) => {
      if (name === "fileDoc" && files) {
        const file = files[0];
        if (file.size > 500 * 1024) {
          toast.error("Ukuran file maksimal adalah 500KB");
          return prevUser;
        } else {
          return {
            ...prevUser,
            [name]: file,
            ["fileName"]: file.name,
          } as MsEmployeeCertificates;
        }
      } else {
        return { ...prevUser, [name]: value } as MsEmployeeCertificates;
      }
    });
  };

  const handleDropdownChange = (value: string) => {
    setSertifikat({
      ...sertifikat,
      docType: value,
    });

    if (value === "OTHERS") {
      setShowInputCertName(true);
    }
  };

  const handleCheckboxChange = (years: number) => {
    setYearsToAdd(years);
    if (sertifikat.certificateDate) {
      sertifikat.certificateValidTo = addYears(
        sertifikat.certificateDate,
        years
      );
    }
  };

  const handleDateChange = (name: string, date: Date) => {
    if (name === "certificateDate") {
      setSertifikat({
        ...sertifikat,
        certificateDate: date,
      });
      if (yearsToAdd > 0) {
        setSertifikat({
          ...sertifikat,
          certificateValidTo: addYears(date, yearsToAdd),
        });
      }
    } else if (name === "certificateValidTo") {
      setSertifikat({
        ...sertifikat,
        certificateValidTo: date,
      });
    }
  };

  const viewFile = () => {
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity()) {
      if (sertifikat.id > 0) {
        sertifikat.aktif = true;
        sertifikat.mode = "EDIT";
      } else {
        sertifikat.rekrutmenId = relasiId;
        sertifikat.modifiedTime = undefined;
        sertifikat.mode = "CREATE";
      }
      sertifikat.docCategory = typeDoc;
      sertifikat.certificateName = sertifikat.certificateName
        ? sertifikat.certificateName
        : sertifikat.docType;
      sertifikat.employeeId = sertifikat.employeeId
        ? sertifikat.employeeId
        : undefined;
      try {
        const ret = await api.postNonAuth(
          sertifikat,
          constant.API_REKRUTMEN_SAVE_CERTIFICATE_NON_AUTH
        );
        if (ret.data.status === "OK" && sertifikat.rekrutmenId) {
          if (!sertifikat.fileDoc) return;
          const fileUpload = new FormData();
          fileUpload.append("file", sertifikat.fileDoc);
          fileUpload.append("certId", ret.data.returnId);
          fileUpload.append("crewId", sertifikat.rekrutmenId.toString());
          fileUpload.append("menuForm", "REKRUTMEN");

          const retUpload = await api.postDocNonAuth(
            fileUpload,
            constant.API_REKRUTMEN_SAVE_CERTIFICATE_DOC_NON_AUTH
          );
          if (retUpload.data.status === "OK") {
            onSubmit();
          } else {
            throw new Error("Failed to save data");
          }
        } else {
          toast.error("Sertifikat gagal tersimpan");
          console.error("Error saving data:", ret.data.message);
        }
      } catch (err) {
        console.error("Error saving data:", err);
        toast.error("Error saving data:");
      }
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Sertifikat
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <DropdownKodeMaster
                  elementId="docType"
                  labelValue="Tipe Dokumen / Sertifikat"
                  constantApi={constantAPI || ""}
                  required={true}
                  defaultValue={sertifikat.docType || ""}
                  onSelect={handleDropdownChange}
                />
              </div>
              {showInputCertName && (
                <div className="mt-2">
                  <label>Nama Sertifikat</label>
                  <input
                    type="text"
                    name="certificateName"
                    value={sertifikat.certificateName}
                    onChange={handleAddSertifikat}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  />
                </div>
              )}
              <div className="mt-2">
                <label>
                  <sup>* </sup>No Sertifikat
                </label>
                <input
                  type="text"
                  name="certificateNo"
                  value={sertifikat.certificateNo}
                  onChange={handleAddSertifikat}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  required
                />
              </div>
              {showInputIssuers && (
                <div className="mt-2">
                  <label>Tempat Pembuatan</label>
                  <input
                    type="text"
                    name="issuers"
                    value={sertifikat.issuers}
                    onChange={handleAddSertifikat}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    required
                  />
                </div>
              )}
              <div className="mt-2">
                <label>
                  <sup>* </sup>
                  Tgl. Sertifikat / Dokumen
                </label>
                <div>
                  <DatePicker
                    //selected={startDate}
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    popperPlacement="top-end"
                    showYearDropdown
                    dropdownMode="select"
                    selected={sertifikat.certificateDate}
                    onChange={(selectedDate: Date) => {
                      handleDateChange("certificateDate", selectedDate);
                    }}
                    dateFormat="dd/MM/yyyy"
                    name="certificateDate"
                    required
                  />
                </div>
              </div>
              <div className="mb-2">
                <input
                  type="checkbox"
                  id="5years"
                  checked={yearsToAdd === 5}
                  onChange={() => handleCheckboxChange(5)}
                />
                <label htmlFor="5years">Berlaku 5 Tahun</label>
              </div>
              <div className="mt-2">
                <input
                  type="checkbox"
                  id="10years"
                  checked={yearsToAdd === 10}
                  onChange={() => handleCheckboxChange(10)}
                />
                <label htmlFor="10years">Berlaku 10 Tahun</label>
              </div>
              <div className="mt-2">
                <label>
                  <sup>* </sup>
                  Tgl. Expired Sertifikat / Dokumen
                </label>
                <div>
                  <DatePicker
                    //selected={startDate}
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    popperPlacement="top-end"
                    showYearDropdown
                    dropdownMode="select"
                    selected={sertifikat.certificateValidTo}
                    onChange={(selectedDate: Date) => {
                      handleDateChange("certificateValidTo", selectedDate);
                    }}
                    dateFormat="dd/MM/yyyy"
                    name="certificateValidTo"
                    required
                  />
                </div>
              </div>
              <div className="mt-2">
                <label>
                  <sup>* </sup>
                  Upload File
                </label>
                <input
                  type="text"
                  name="fileName"
                  value={sertifikat.fileName}
                  onChange={handleAddSertifikat}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  readOnly
                  placeholder="Klik button Upload File (format file .pdf)"
                  required
                />
              </div>
              <div className="mt-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleAddSertifikat}
                  className="hidden"
                  id="pdf-upload"
                  name="fileDoc"
                />
                <label
                  htmlFor="pdf-upload"
                  className="mr-1 px-3 py-1 bg-green-700 text-white rounded cursor-pointer"
                >
                  Upload File
                </label>

                <input type="button" onClick={viewFile} id="pdf-view" />
                <label
                  htmlFor="pdf-view"
                  className="ml-1 px-3 py-1 bg-yellow-600 text-white rounded cursor-pointer"
                >
                  View File
                </label>
              </div>
              <div className="mt-2">
                <label>Keterangan</label>
                <input
                  type="text"
                  name="keterangan"
                  value={sertifikat.keterangan}
                  onChange={handleAddSertifikat}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                />
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showModal && (
        <ModalViewDokumen
          file={sertifikat.fileDoc}
          fileLink={sertifikat.fileLink || ""}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ModalEditSertifikat;
