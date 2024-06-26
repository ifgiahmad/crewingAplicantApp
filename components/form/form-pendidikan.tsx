import { useState, useEffect } from "react";
import MsEmployeeEducations from "../../app/models/MsEmployeeEducation";
import api from "@/app/lib/api";
import { constant, formatDate } from "@/app/lib/helper";
import {
  IoPencil,
  IoPencilOutline,
  IoPencilSharp,
  IoTrashBinSharp,
  IoTrashOutline,
  IoTrashSharp,
} from "react-icons/io5";
import ModalEditPendidikan from "../modal/modal-edit-pendidikan";
import { Toaster, toast } from "sonner";
import ModalDeleteData from "../modal/modal-delete-data";

interface FormPendidikanProps {
  onNext: (id: number) => void;
  onPrevious: (id: number) => void;
  rekrutmenId: number;
}

const FormPendidikan: React.FC<FormPendidikanProps> = ({
  onNext,
  onPrevious,
  rekrutmenId,
}) => {
  const [listPendidikan, setListPendidikan] = useState<MsEmployeeEducations[]>(
    []
  );
  const [showModal, setShowModal] = useState(false);
  const [idData, setIdData] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleOpenModal = (id: number) => {
    setShowModal(true);
    setIdData(id);
  };

  const handleDeleteModal = (id: number) => {
    setShowDeleteModal(true);
    setIdData(id);
  };

  const handleNext = async () => {
    onNext(rekrutmenId);
  };

  const handlePrevious = async () => {
    onPrevious(rekrutmenId);
  };

  useEffect(() => {
    if (rekrutmenId > 0) {
      getListData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getListData = async () => {
    try {
      const data = await api.getListDataById(
        rekrutmenId,
        constant.API_REKRUTMEN_LIST_EDUCATIONS_ID_NON_AUTH,
        "REKRUTMEN"
      );

      const listPendidikan = data.data.map(
        (item: any) =>
          new MsEmployeeEducations(
            item.id,
            item.employeeId,
            item.rekrutmenId,
            item.pendidikan,
            item.jurusan,
            item.namaInstitusi,
            item.kota,
            item.tglSelesai,
            item.createdBy,
            item.createdTime,
            item.modifiedBy,
            item.modifiedTime,
            item.aktif
          )
      );
      setListPendidikan(listPendidikan);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = (action: string) => {
    if (action === "SAVE") {
      setShowModal(false);
      toast.success("Pendidikan berhasil tersimpan");
    } else {
      setShowDeleteModal(false);
      toast.error("Pendidikan berhasil terhapus");
    }

    getListData();
  };

  return (
    <div>
      {/*  <h2 className="text-xl mb-4">Pendidikan</h2>
       */}
      <div className=" p-4 bg-gray-100 ">
        <div className="bg-white mb-2 p-6 rounded-lg shadow-md overflow-y-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="text-sm text-gray-700 uppercase bg-yellow-500 rounded-lg">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-2 border text-center tracking-wider sm:table-cell"
                >
                  <button
                    onClick={() => handleOpenModal(0)}
                    className=" bottom-4 right-4 px-4 py-2  bg-green-800 text-white rounded-full shadow-lg hover:bg-green-500"
                  >
                    Tambah Pendidikan
                  </button>
                </th>
                <th className="px-4 py-2 border tracking-wider sm:table-cell">
                  Pendidikan
                </th>
                <th className="px-4 py-2 border tracking-wider sm:table-cell">
                  Jurusan
                </th>
                <th className="px-4 py-2 border tracking-wider sm:table-cell">
                  Nama Institusi
                </th>
                <th className="px-4 py-2 border tracking-wider sm:table-cell">
                  Kota
                </th>
                <th className="px-4 py-2 border tracking-wider sm:table-cell">
                  Tanggal Selesai
                </th>
              </tr>
            </thead>
            <tbody>
              {listPendidikan
                .filter((x) => x.aktif === true)
                .map((item, index) => (
                  <tr key={index} className="table-row">
                    <td className="px-4 py-2 text-sm border">
                      <button
                        onClick={() => handleOpenModal(item.id)}
                        className=" hover:bg-blue-600 border border-blue-500 rounded-sm p-1 ml-2"
                      >
                        <IoPencilSharp size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteModal(item.id)}
                        className="ml-2 rounded-sm p-1 border border-red-500 hover:bg-red-600"
                      >
                        <IoTrashSharp size={20} />
                      </button>
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.pendidikan}
                    </td>
                    <td className="px-4 py-2 text-sm border">{item.jurusan}</td>
                    <td className="px-4 py-2 text-sm border">
                      {item.namaInstitusi}
                    </td>
                    <td className="px-4 py-2 text-sm border">{item.kota}</td>
                    <td className="px-4 py-2 text-sm border">
                      {item.tglSelesai
                        ? formatDate(item.tglSelesai.toString())
                        : ""}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex-1 bg-white flex items-center justify-end right-4 mb-2 p-3 rounded-lg shadow-md space-x-2">
        <button
          onClick={handlePrevious}
          type="submit"
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-full shadow-lg"
        >
          Kembali
        </button>

        <button
          onClick={handleNext}
          type="submit"
          className="px-4 py-2 bg-green-800 hover:bg-green-500 text-white rounded-full shadow-lg"
        >
          Simpan & Lanjutkan
        </button>
      </div>
      {showModal && (
        <ModalEditPendidikan
          relasiId={rekrutmenId}
          Id={idData}
          onClose={() => setShowModal(false)}
          onSubmit={() => handleSubmit("SAVE")}
        />
      )}
      {showDeleteModal && (
        <ModalDeleteData
          modelType="PENDIDIKAN"
          id={idData}
          onClose={() => setShowDeleteModal(false)}
          onSubmit={() => handleSubmit("DELETE")}
        />
      )}
    </div>
  );
};

export default FormPendidikan;
