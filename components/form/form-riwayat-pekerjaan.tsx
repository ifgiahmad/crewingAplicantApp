import { useState, useEffect } from "react";
import CrewingLogs from "@/app/models/CrewingLog";
import { constant, formatDate } from "@/app/lib/helper";
import {
  IoEyeSharp,
  IoPencil,
  IoPencilSharp,
  IoTrashOutline,
  IoTrashSharp,
} from "react-icons/io5";
//import ModalEditRiwayatPekerjaan from "../modal/modal-edit-RiwayatPekerjaan";
import { Toaster, toast } from "sonner";
import api from "@/app/lib/api";
import ModalEditRiwayatPekerjaan from "../modal/modal-edit-riwayat-pekerjaan";
import ModalDeleteData from "../modal/modal-delete-data";
import ModalViewDokumen from "../modal/modal-view-dokumen";

interface FormRiwayatPekerjaanProps {
  onNext: (id: number) => void;
  onPrevious: (id: number) => void;
  rekrutmenId: number;
}

const FormRiwayatPekerjaan: React.FC<FormRiwayatPekerjaanProps> = ({
  onNext,
  onPrevious,
  rekrutmenId,
}) => {
  const [listRiwayatPekerjaan, setListRiwayatPekerjaan] = useState<
    CrewingLogs[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [idData, setIdData] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewDocModal, setShowViewDocModal] = useState(false);
  const [fileLink, setFileLink] = useState<string | null>(null);

  const handleOpenModal = (id: number) => {
    setShowModal(true);
    setIdData(id);
  };

  const handleViewDocModal = (fileLink: string) => {
    setShowViewDocModal(true);
    setFileLink(fileLink);
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
      const data = await api.getListDataRiwayatPekerjaanId(rekrutmenId);
      const listRiwayatPekerjaan = data.data.map(
        (item: any) =>
          new CrewingLogs(
            item.id,
            item.employeeId,
            item.perusahaan,
            item.tanggal,
            item.tanggalSelesai,
            item.status,
            item.kapal,
            item.gtKapal,
            item.jabatan,
            item.alasanOff,
            item.keterangan,
            item.currency,
            item.gajiTerakhir,
            item.createdBy,
            item.createdTime,
            item.modifiedBy,
            item.modifiedTime,
            item.rekrutmenId,
            item.fileName,
            item.filePath,
            item.fileLink
          )
      );
      setListRiwayatPekerjaan(listRiwayatPekerjaan);
      console.log(listRiwayatPekerjaan);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = (action: string) => {
    if (action === "SAVE") {
      setShowModal(false);
      toast.success("Riwayat Pekerjaan berhasil tersimpan");
    } else {
      setShowDeleteModal(false);
      toast.error("Riwayat Pekerjaan berhasil terhapus");
    }
    getListData();
  };

  return (
    <div>
      <div className="p-4  bg-gray-100 flex flex-col overflow-x-auto max-h-screen">
        <div className="flex-1 bg-white mb-2 p-6 rounded-lg shadow-md overflow-y-auto max-w-screen-xl">
          <table className="min-w-full bg-white border border-gray-300 ">
            <thead className="text-sm text-gray-700 uppercase bg-yellow-500 rounded-lg">
              <tr>
                <th className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleOpenModal(0)}
                    className=" bottom-4 right-4 px-4 py-2  bg-green-800 hover:bg-green-500 text-white rounded-full shadow-lg"
                  >
                    Tambah Riwayat
                  </button>
                </th>
                <th className="px-4 py-2 border">Perusahaan</th>
                <th className="px-4 py-2 border">Kapal</th>
                <th className="px-4 py-2 border">GT Kapal</th>
                <th className="px-4 py-2 border">Jabatan</th>
                <th className="px-4 py-2 border">Alasan Off</th>
                <th className="px-4 py-2 border">Tanggal</th>
                <th className="px-4 py-2 border">Tanggal Selesai</th>
                <th className="px-4 py-2 border">Currency</th>
                <th className="px-4 py-2 border">Gaji Terakhir</th>
                {/* <th className="px-4 py-2 border">File</th> */}
              </tr>
            </thead>
            <tbody>
              {listRiwayatPekerjaan.map((item, index) => (
                <tr key={index} className="table-row">
                  <td className="px-3 py-2 border">
                    <button
                      onClick={() => handleOpenModal(item.id)}
                      className=" hover:bg-blue-600 border border-blue-500 rounded-sm p-1 ml-2"
                    >
                      <IoPencilSharp size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteModal(item.id)}
                      className=" rounded-sm p-1 border border-red-500 hover:bg-red-600 ml-2"
                    >
                      <IoTrashSharp size={20} />
                    </button>
                    <button
                      onClick={() => handleViewDocModal(item.fileLink || "")}
                      className="rounded-sm border border-yellow-500 p-1 hover:bg-yellow-600 ml-2"
                    >
                      <IoEyeSharp size={20} />
                    </button>
                  </td>
                  <td className="px-4 py-2 border">{item.perusahaan}</td>
                  <td className="px-4 py-2 border">{item.kapal}</td>
                  <td className="px-4 py-2 border">{item.gtKapal}</td>
                  <td className="px-4 py-2 border">{item.jabatan}</td>
                  <td className="px-4 py-2 border">{item.alasanOff}</td>
                  <td className="px-4 py-2 border">
                    {item.tanggal ? formatDate(item.tanggal.toString()) : ""}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.tanggalSelesai
                      ? formatDate(item.tanggalSelesai.toString())
                      : ""}
                  </td>
                  <td className="px-4 py-2 border">{item.currency}</td>
                  <td className="px-4 py-2 border">{item.gajiTerakhir}</td>
                  {/*  <td className="px-4 py-2 border">{item.fileLink}</td> */}
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
        <ModalEditRiwayatPekerjaan
          relasiId={rekrutmenId}
          id={idData}
          onClose={() => setShowModal(false)}
          onSubmit={() => handleSubmit("SAVE")}
        />
      )}
      {showDeleteModal && (
        <ModalDeleteData
          modelType="RIWAYAT PEKERJAAN"
          id={idData}
          onClose={() => setShowDeleteModal(false)}
          onSubmit={() => handleSubmit("DELETE")}
        />
      )}
      {showViewDocModal && (
        <ModalViewDokumen
          file={null}
          fileLink={fileLink || ""}
          onClose={() => setShowViewDocModal(false)}
        />
      )}
    </div>
  );
};

export default FormRiwayatPekerjaan;
