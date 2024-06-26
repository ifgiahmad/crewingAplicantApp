import { useState, useEffect } from "react";
import MsEmployeeEducations from "@/app/models/MsEmployeeEducation";
import api from "@/app/lib/api";
import { constant } from "@/app/lib/helper";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropdownKodeMaster from "../dropdown-list-kode-master";
import { useForm } from "react-hook-form";

interface ModalEditPendidikanProps {
  relasiId: number;
  Id: number;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalEditPendidikan: React.FC<ModalEditPendidikanProps> = ({
  relasiId,
  Id,
  onClose,
  onSubmit,
}) => {
  const [pendidikan, setPendidikan] = useState<MsEmployeeEducations>(
    new MsEmployeeEducations()
  );

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Id > 0 && pendidikan.id === 0) {
      getEducationById(Id);
    } else {
      pendidikan.rekrutmenId = relasiId;
    }
    async function getEducationById(Id: number) {
      try {
        const data = await api.getDataByIdNonAuth(
          Id,
          constant.API_REKRUTMEN_GET_EDUCATION_ID_NON_AUTH
        ); // Ganti dengan ID yang diinginkan
        setPendidikan(data);
      } catch (err) {
        setError("Gagal mengambil data pendidikan");
        console.error(err);
      }
    }
  }, [Id, pendidikan, relasiId]);

  const handleAddPendidikan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPendidikan((prevUser) => {
      if (name === "tglSelesai") {
        return { ...prevUser, [name]: new Date(value) } as MsEmployeeEducations;
      } else {
        return { ...prevUser, [name]: value } as MsEmployeeEducations;
      }
    });
  };

  const handleDropdownChange = (value: string) => {
    setPendidikan({
      ...pendidikan,
      pendidikan: value,
    });
  };

  const handleDateChange = (name: string, date: Date) => {
    if (name === "tglSelesai") {
      setPendidikan({
        ...pendidikan,
        tglSelesai: date,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity()) {
      if (pendidikan.id > 0) {
        pendidikan.aktif = true;
        pendidikan.mode = "EDIT";
      } else {
        pendidikan.rekrutmenId = relasiId;
        //pendidikan.tglSelesai = undefined;
        pendidikan.modifiedTime = undefined;
        pendidikan.mode = "CREATE";
      }
      pendidikan.menuForm = "REKRUTMEN";
      pendidikan.employeeId = pendidikan.employeeId
        ? pendidikan.employeeId
        : undefined;
      try {
        const ret = await api.postNonAuth(
          pendidikan,
          constant.API_REKRUTMEN_SAVE_EDUCATION_NON_AUTH
        );
        if (ret.data.status === "OK") {
          onSubmit();
        } else {
          throw new Error("Failed to save data");
        }
      } catch (err) {
        console.error("Error saving data:", error);
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
              Pendidikan
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <DropdownKodeMaster
                  elementId="pendidikan"
                  labelValue="Pendidikan"
                  constantApi={constant.MASTER_TYPE_PENDIDIKAN}
                  required={true}
                  defaultValue={pendidikan.pendidikan || ""}
                  onSelect={handleDropdownChange}
                />
              </div>
              <div className="mt-2">
                <label>
                  <sup>* </sup>
                  Jurusan
                </label>
                <input
                  type="text"
                  name="jurusan"
                  value={pendidikan.jurusan}
                  onChange={handleAddPendidikan}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  required
                />
              </div>
              <div className="mt-2">
                <label>
                  <sup>* </sup>
                  Institusi
                </label>
                <input
                  type="text"
                  name="namaInstitusi"
                  value={pendidikan.namaInstitusi}
                  onChange={handleAddPendidikan}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  required
                />
              </div>
              <div className="mt-2">
                <label>
                  <sup>* </sup>
                  Kota
                </label>
                <input
                  type="text"
                  name="kota"
                  value={pendidikan.kota}
                  onChange={handleAddPendidikan}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  required
                />
              </div>

              <div className="mt-2">
                <label>
                  <sup>* </sup>
                  Tahun Selesai
                </label>
                <div>
                  <DatePicker
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    popperPlacement="top-end"
                    showYearDropdown
                    dropdownMode="select"
                    selected={pendidikan.tglSelesai}
                    onChange={(selectedDate: Date) => {
                      handleDateChange("tglSelesai", selectedDate);
                    }}
                    dateFormat="dd/MM/yyyy"
                    name="tglSelesai"
                    required
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  // onClick={handleSubmit}
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
    </div>
  );
};

export default ModalEditPendidikan;
