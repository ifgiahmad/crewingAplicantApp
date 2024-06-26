import { useState, useEffect, ChangeEvent } from "react";
import OptionalFileRekrutmens from "@/app/models/OptionalFileRekrutmen";
import api from "@/app/lib/api";
import { constant } from "@/app/lib/helper";
import { Toaster, toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropdownKodeMaster from "../dropdown-list-kode-master";
import ModalViewDokumen from "./modal-view-dokumen";
interface ModalEditFilePendukungProps {
  relasiId: number;
  id: number;

  onClose: () => void;
  onSubmit: () => void;
}

const ModalEditFilePendukung: React.FC<ModalEditFilePendukungProps> = ({
  relasiId,
  id,

  onClose,
  onSubmit,
}) => {
  const [FilePendukung, setFilePendukung] = useState<OptionalFileRekrutmens>(
    new OptionalFileRekrutmens()
  );
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ form?: string }>({});
  const [showInputValidDate, setShowInputValidDate] = useState<boolean>(false);
  const [countMCU, setCountMCU] = useState<boolean>(false);
  const [countAFF, setCountAFF] = useState<boolean>(false);
  const [countBST, setCountBST] = useState<boolean>(false);
  const [countSCRB, setCountSCRB] = useState<boolean>(false);
  const [countORU, setCountORU] = useState<boolean>(false);

  useEffect(() => {
    if (id > 0 && FilePendukung.id === 0) {
      getDataById(id);
    } else {
      FilePendukung.rekrutmenId = relasiId;
    }
  }, [id, FilePendukung, relasiId]);

  const getDataById = async (Id: number) => {
    try {
      const data = await api.getDataByIdNonAuth(
        Id,
        constant.API_REKRUTMEN_GET_OPTIONAL_FILE_ID_NON_AUTH
      );
      setFilePendukung(data);
    } catch (error) {
      toast.error("Gagal Fetching Data");
      console.error("Error fetching data:", error);
    }
  };

  const handleAddFilePendukung = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFilePendukung((prevUser) => {
      if (name === "fileDoc" && files) {
        const file = files[0];
        if (file.size > 500 * 1024) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            file: "Ukuran file maksimal adalah 500KB",
          }));
          return prevUser;
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, foto: undefined }));
          return {
            ...prevUser,
            [name]: file,
            ["fileName"]: file.name,
          } as OptionalFileRekrutmens;
        }
      } else {
        return { ...prevUser, [name]: value } as OptionalFileRekrutmens;
      }
    });
  };

  const handleDateChange = (name: string, date: Date) => {
    if (name === "documentDate") {
      setFilePendukung({
        ...FilePendukung,
        documentDate: date,
      });
    } else if (name === "documentValidDate") {
      setFilePendukung({
        ...FilePendukung,
        documentValidDate: date,
      });
    }
  };

  const handleDropdownChange = (value: string) => {
    setFilePendukung({
      ...FilePendukung,
      fileCategory: value,
      documentName: value,
      documentValidDate:
        value === "MCU" ? FilePendukung.documentValidDate : undefined,
    });
    if (value === "MCU") {
      setShowInputValidDate(true);
    } else {
      setShowInputValidDate(false);
    }
    FilePendukung.documentValidDate =
      FilePendukung.fileCategory === "MCU"
        ? FilePendukung.documentValidDate
        : undefined;
  };

  const viewFile = () => {
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity()) {
      if (FilePendukung.id > 0) {
        FilePendukung.aktif = true;
        FilePendukung.mode = "EDIT";
      } else {
        FilePendukung.rekrutmenId = relasiId;
        FilePendukung.modifiedDate = undefined;
        FilePendukung.mode = "CREATE";
      }
      FilePendukung.crewingId = FilePendukung.crewingId
        ? FilePendukung.crewingId
        : undefined;
      FilePendukung.documentName = FilePendukung.fileCategory;
      FilePendukung.documentValidDate =
        FilePendukung.fileCategory === "MCU"
          ? FilePendukung.documentValidDate
          : undefined;
      try {
        const ret = await api.postNonAuth(
          FilePendukung,
          constant.API_REKRUTMEN_SAVE_OPTIONAL_FILE_NON_AUTH
        );
        if (ret.data.status === "OK" && FilePendukung.rekrutmenId) {
          if (!FilePendukung.fileDoc) return;
          const fileUpload = new FormData();
          fileUpload.append("file", FilePendukung.fileDoc);
          fileUpload.append("optId", ret.data.returnId);
          fileUpload.append("relasiId", FilePendukung.rekrutmenId.toString());
          fileUpload.append("menuForm", "REKRUTMEN");

          const retUpload = await api.postDocNonAuth(
            fileUpload,
            constant.API_REKRUTMEN_SAVE_OPTIONAL_FILE_DOC_NON_AUTH
          );
          if (retUpload.data.status === "OK") {
            onSubmit();
          } else {
            throw new Error("Failed to save data");
          }
        } else {
          toast.error("FilePendukung berhasil tersimpan");
        }
      } catch (err) {
        console.error("Error saving data:", error);
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
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
              File Pendukung
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <DropdownKodeMaster
                  elementId="fileCategory"
                  labelValue="Tipe Dokumen"
                  constantApi={constant.MASTER_TYPE_OPTIONAL_DOC}
                  required={true}
                  defaultValue={FilePendukung.fileCategory || ""}
                  onSelect={handleDropdownChange}
                />
              </div>
              <div className="mt-2">
                <label>
                  <sup>* </sup>
                  Tgl. Pembuatan
                </label>
                <div>
                  <DatePicker
                    //selected={startDate}
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    popperPlacement="top-end"
                    showYearDropdown
                    dropdownMode="select"
                    selected={FilePendukung.documentDate}
                    onChange={(selectedDate: Date) => {
                      handleDateChange("documentDate", selectedDate);
                    }}
                    dateFormat="dd/MM/yyyy"
                    name="documentDate"
                    required
                  />
                </div>
              </div>
              {showInputValidDate && (
                <div className="mt-2">
                  <label>
                    <sup>* </sup>
                    Tgl. Valid Dokumen
                  </label>
                  <div>
                    <DatePicker
                      //selected={startDate}
                      className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                      popperPlacement="top-start"
                      showYearDropdown
                      dropdownMode="select"
                      selected={FilePendukung.documentValidDate}
                      onChange={(selectedDate: Date) => {
                        handleDateChange("documentValidDate", selectedDate);
                      }}
                      dateFormat="dd/MM/yyyy"
                      name="documentValidDate"
                      required
                    />
                  </div>
                </div>
              )}
              <div className="mt-2">
                <label>
                  <sup>* </sup>
                  Upload File
                </label>
                <input
                  type="text"
                  name="fileName"
                  value={FilePendukung.fileName}
                  onChange={handleAddFilePendukung}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  readOnly
                  placeholder="Upload file dengan klik button upload"
                />
              </div>
              <div className="mt-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleAddFilePendukung}
                  className="hidden"
                  id="pdf-upload"
                  name="fileDoc"
                />
                <label
                  htmlFor="pdf-upload"
                  className="mr-1 px-3 py-1 bg-green-700 text-white rounded cursor-pointer"
                >
                  Upload PDF
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
                  value={FilePendukung.keterangan}
                  onChange={handleAddFilePendukung}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                />
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-700 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
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
          file={FilePendukung.fileDoc}
          fileLink={FilePendukung.fileLink || ""}
          //typeDoc={"OPTIONAL"}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ModalEditFilePendukung;
