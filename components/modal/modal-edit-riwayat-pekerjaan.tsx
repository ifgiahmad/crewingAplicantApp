import { useState, useEffect } from "react";
import CrewingLogs from "@/app/models/CrewingLog";
import api from "@/app/lib/api";
import { constant } from "@/app/lib/helper";
import { Toaster, toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropdownKodeMaster from "../dropdown-list-kode-master";
import ModalViewDokumen from "./modal-view-dokumen";
import CurrencyInput from "react-currency-input-field";
interface ModalEditRiwayatPekerjaanProps {
  relasiId: number;
  id: number;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalEditRiwayatPekerjaan: React.FC<ModalEditRiwayatPekerjaanProps> = ({
  relasiId,
  id,
  onClose,
  onSubmit,
}) => {
  const [riwayatPekerjaan, setRiwayatPekerjaan] = useState<CrewingLogs>(
    new CrewingLogs()
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (id > 0 && riwayatPekerjaan.id === 0) {
      getDataById(id);
    } else {
      riwayatPekerjaan.rekrutmenId = relasiId;
    }
    async function getDataById(Id: number) {
      try {
        const data = await api.getDataByIdNonAuth(
          Id,
          constant.API_REKRUTMEN_GET_RIWAYAT_PEKERJAAN_ID_NON_AUTH
        );
        setRiwayatPekerjaan(data);
      } catch (err) {
        toast.error("Gagal fetch data Riwayat Pekerjaan");
        console.error(err);
      }
    }
  }, [id, riwayatPekerjaan, relasiId]);

  const handleAddRiwayatPekerjaan = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, files } = e.target;
    setRiwayatPekerjaan((prevUser) => {
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
          } as CrewingLogs;
        }
      } else {
        return { ...prevUser, [name]: value } as CrewingLogs;
      }
    });
  };

  const handleDateChange = (name: string, date: Date) => {
    if (name === "tanggal") {
      setRiwayatPekerjaan({
        ...riwayatPekerjaan,
        tanggal: date,
      });
    } else {
      setRiwayatPekerjaan({
        ...riwayatPekerjaan,
        tanggalSelesai: date,
      });
    }
  };

  const handleDropdownChange = (name: string, value: string) => {
    if (name === "jabatan") {
      setRiwayatPekerjaan({
        ...riwayatPekerjaan,
        jabatan: value,
      });
    } else {
      setRiwayatPekerjaan({
        ...riwayatPekerjaan,
        currency: value,
      });
    }
  };

  const handleCurrencyChange = (name: string, value: string) => {
    setRiwayatPekerjaan({
      ...riwayatPekerjaan,
      gajiTerakhir: parseFloat(value),
    });
  };

  const viewFile = () => {
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity()) {
      if (riwayatPekerjaan.id > 0) {
        riwayatPekerjaan.mode = "EDIT";
      } else {
        riwayatPekerjaan.rekrutmenId = relasiId;
        riwayatPekerjaan.mode = "CREATE";
        riwayatPekerjaan.modifiedTime = undefined;
        riwayatPekerjaan.createdTime = new Date();
      }
      riwayatPekerjaan.menuForm = "REKRUTMEN";
      riwayatPekerjaan.employeeId = riwayatPekerjaan.employeeId
        ? riwayatPekerjaan.employeeId
        : undefined;
      console.log(riwayatPekerjaan);
      try {
        const ret = await api.postNonAuth(
          riwayatPekerjaan,
          constant.API_REKRUTMEN_SAVE_RIWAYAT_NON_AUTH
        );
        console.log(ret);
        if (ret.data.status === "OK" && riwayatPekerjaan.rekrutmenId) {
          if (!riwayatPekerjaan.fileDoc) return;
          const fileUpload = new FormData();
          fileUpload.append("file", riwayatPekerjaan.fileDoc);
          fileUpload.append("riwayatId", ret.data.returnId);
          fileUpload.append("rekId", riwayatPekerjaan.rekrutmenId.toString());
          fileUpload.append("menuForm", "REKRUTMEN");

          const retUpload = await api.postDocNonAuth(
            fileUpload,
            constant.API_REKRUTMEN_SAVE_RIWAYAT_DOC_NON_AUTH
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
        toast.error("Server gagal menyimpan");
        console.error("Error saving data:", err);
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
              Riwayat Pekerjaan
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mt-2">
                <label>
                  <sup>* </sup>
                  Perusahaan
                </label>
                <input
                  type="text"
                  name="perusahaan"
                  value={riwayatPekerjaan.perusahaan || ""}
                  onChange={handleAddRiwayatPekerjaan}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  placeholder=""
                  required
                />
              </div>
              <div className="mt-2">
                <label>
                  <sup>* </sup>
                  Kapal
                </label>
                <input
                  type="text"
                  name="kapal"
                  value={riwayatPekerjaan.kapal}
                  onChange={handleAddRiwayatPekerjaan}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  required
                />
              </div>
              <div className="mt-2">
                <label>
                  {/* <sup>* </sup> */}
                  GT Kapal
                </label>
                <input
                  type="text"
                  name="gtKapal"
                  value={riwayatPekerjaan.gtKapal}
                  onChange={handleAddRiwayatPekerjaan}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  /*  required */
                />
              </div>
              <div className="mb-2">
                <DropdownKodeMaster
                  elementId="jabatan"
                  labelValue="Jabatan"
                  constantApi={constant.MASTER_TYPE_CREW_LVL}
                  required={true}
                  defaultValue={riwayatPekerjaan.jabatan || ""}
                  onSelect={(value: string) => {
                    handleDropdownChange("jabatan", value);
                  }}
                />
              </div>
              <div className="mt-2">
                <label>
                  <sup>* </sup>
                  Alasan Off
                </label>
                <input
                  type="text"
                  name="alasanOff"
                  value={riwayatPekerjaan.alasanOff}
                  onChange={handleAddRiwayatPekerjaan}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  required
                />
              </div>
              <div className="mt-2">
                <label>
                  <sup>* </sup>
                  Tgl. Mulai
                </label>
                <div>
                  <DatePicker
                    popperPlacement="top-end"
                    showYearDropdown
                    dropdownMode="select"
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    selected={riwayatPekerjaan.tanggal}
                    onChange={(selectedDate: Date) => {
                      handleDateChange("tanggal", selectedDate);
                    }}
                    dateFormat="dd/MM/yyyy"
                    name="tanggal"
                    required
                  />
                </div>
              </div>
              <div className="mt-2">
                <label>Tgl. Selesai</label>
                <div>
                  <DatePicker
                    popperPlacement="top-end"
                    showYearDropdown
                    dropdownMode="select"
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    selected={riwayatPekerjaan.tanggalSelesai}
                    onChange={(selectedDate: Date) => {
                      handleDateChange("tanggalSelesai", selectedDate);
                    }}
                    dateFormat="dd/MM/yyyy"
                    name="tanggalSelesai"
                  />
                </div>
              </div>
              <div className="mb-2">
                <DropdownKodeMaster
                  elementId="currency"
                  labelValue="Currency"
                  constantApi={constant.MASTER_CURRENCY_NON_AUTH}
                  required={false}
                  defaultValue={riwayatPekerjaan.currency || ""}
                  //onSelect={handleDropdownChange}
                  onSelect={(value: string) => {
                    handleDropdownChange("currency", value);
                  }}
                />
              </div>
              <div className="mb-2">
                <label>Gaji Terakhir</label>
                <div>
                  <CurrencyInput
                    id="gajiTerakhir"
                    name="gajiTerakhir"
                    placeholder="Masukan Angka"
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    //defaultValue={riwayatPekerjaan.gajiTerakhir}
                    decimalsLimit={2}
                    value={riwayatPekerjaan.gajiTerakhir}
                    onValueChange={(value, name, values) =>
                      handleCurrencyChange(name || "", value || "")
                    }
                  />
                </div>
              </div>
              <div className="mt-2">
                <label>Surat Sign Off</label>
                <input
                  type="text"
                  name="fileName"
                  value={riwayatPekerjaan.fileName}
                  onChange={handleAddRiwayatPekerjaan}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  readOnly
                  placeholder="Klik button Upload File untuk upload surat sign off (format file .pdf)"
                />
              </div>
              <div className="mt-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleAddRiwayatPekerjaan}
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
          file={riwayatPekerjaan.fileDoc}
          fileLink={riwayatPekerjaan.fileLink || ""}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ModalEditRiwayatPekerjaan;
