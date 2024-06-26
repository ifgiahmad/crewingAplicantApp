import { useState, useEffect } from "react";
import OptionalFileRekrutmens from "@/app/models/OptionalFileRekrutmen";
import api from "@/app/lib/api";
import { constant, formatDate, valCertificate } from "@/app/lib/helper";
import { IoEyeSharp, IoPencilSharp, IoTrashSharp } from "react-icons/io5";
import ModalEditFilePendukung from "../modal/modal-edit-file-pendukung";
import { Toaster, toast } from "sonner";
import ModalDeleteData from "../modal/modal-delete-data";
import ModalViewDokumen from "../modal/modal-view-dokumen";
import CrewRekrutmen from "@/app/models/CrewRekrutmen";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface FormFilePendukungProps {
  onNext: (id: number) => void;
  onPrevious: (id: number) => void;
  rekrutmenId: number;
}

const FormFilePendukung: React.FC<FormFilePendukungProps> = ({
  onNext,
  onPrevious,
  rekrutmenId,
}) => {
  const router = useRouter();
  const [listFilePendukung, setListFilePendukung] = useState<
    OptionalFileRekrutmens[]
  >([]);
  const [rekrutmen, setCrewRekrutmen] = useState<CrewRekrutmen>(
    new CrewRekrutmen()
  );
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idData, setIdData] = useState(0);
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
  const handleSubmitOnboard = async () => {
    try {
      const valCert = valCertificate(rekrutmenId);
      if ((await valCert).isSuccess) {
        const dataCrew = await api.getDataIdNonAuth(
          rekrutmenId,
          constant.API_REKRUTMEN_GET_NON_AUTH
        );
        if (dataCrew.data) {
          const updatedRekrutmen = { ...dataCrew.data, isCompletedData: true };
          setCrewRekrutmen(updatedRekrutmen);

          const ret = await api.postNonAuth(
            rekrutmen,
            constant.API_REKRUTMEN_SAVE_NON_AUTH
          );
          if (!ret.status) {
            Swal.fire({
              icon: "error",
              title: "Submit Gagal",
              text: "Gagal menyimpan data",
            });
          } else {
            Swal.fire({
              icon: "success",
              title: "Berhasil menyimpan data",
              confirmButtonText: "Selesai",
              text: "Terima kasih, Kami akan segera memproses lamaran sudara dan memberikan informasi lebih lanjut.<br> Klik Selesai untuk menyelesaikan pendaftaran.",
            }).then((result) => {
              if (result.isConfirmed) {
                router.push(`/onboardchecking`);
              }
            });
          }
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Submit Gagal",
          html: (await valCert).message,
        });
      }
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Submit Gagal",
        text: "Data tidak valid",
      });
      console.error("Error saving data:", e);
    }
  };

  const handlePrevious = async () => {
    onPrevious(rekrutmenId);
  };

  useEffect(() => {
    if (rekrutmenId > 0) {
      getListData();
    }

    if (rekrutmen.isCompletedData) {
      const updateAndPostData = async () => {
        const ret = await api.postNonAuth(
          rekrutmen,
          constant.API_REKRUTMEN_SAVE_NON_AUTH
        );
        // Lakukan sesuatu dengan hasil ret
      };
      updateAndPostData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rekrutmen]);

  const getListData = async () => {
    try {
      const data = await api.getListDataFilePendukungId(
        rekrutmenId,
        constant.API_REKRUTMEN_LIST_OPTIONAL_FILE_ID_NON_AUTH,
        "REKRUTMEN"
      );

      const listFilePendukung = data.data.map(
        (item: any) =>
          new OptionalFileRekrutmens(
            item.id,
            item.crewingId,
            item.rekrutmenId,
            item.fileCategory,
            item.fileName,
            item.documentName,
            item.documentDate,
            item.documentValidDate,
            item.keterangan,
            item.filePath,
            item.fileLink,
            item.aktif,
            item.createdBy,
            item.createdDate,
            item.modifiedBy,
            item.modifiedDate
          )
      );
      setListFilePendukung(listFilePendukung);
    } catch (error) {
      console.error("Error fetching data File Pendukung:", error);
    }
  };

  const handleSubmit = (action: string) => {
    if (action === "SAVE") {
      setShowModal(false);
      toast.success("FilePendukung berhasil tersimpan");
    } else {
      setShowDeleteModal(false);
      toast.success("FilePendukung berhasil terhapus");
    }
    getListData();
  };
  const handleDelete = () => {
    toast.success("FilePendukung berhasil terhapus");

    getListData();
    setShowDeleteModal(false);
  };

  return (
    <div>
      <div className="p-4 max-h-screen bg-gray-100 flex flex-col overflow-x-auto">
        <div className="flex-1 bg-white mb-2 p-6 rounded-lg shadow-md  overflow-y-auto max-w-screen-xl">
          <div className=" bg-gray-300 mb-2 p-6 rounded-lg shadow-md  overflow-y-auto max-w-screen-xl">
            <p>
              Anda diwajibkan untuk upload Dokumen Medical Check Up ( MCU ) -
              (format .PDF)
            </p>
          </div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="text-sm text-gray-700 uppercase bg-yellow-500 rounded-lg">
              <tr>
                <th className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleOpenModal(0)}
                    className=" bottom-4 right-4 px-4 py-2  bg-green-800 hover:bg-green-500 text-white rounded-full shadow-lg"
                  >
                    Tambah File Pendukung
                  </button>
                </th>
                <th className="px-4 py-2 border">File Category</th>
                <th className="px-4 py-2 border">Tgl. Dokumen</th>
                <th className="px-4 py-2 border">Tgl. Valid Dokumen</th>
                <th className="px-4 py-2 border">Keterangan</th>
                {/*  <th className="px-4 py-2 border">File</th> */}
              </tr>
            </thead>
            <tbody>
              {listFilePendukung.map((item, index) => (
                <tr key={index} className="table-row">
                  <td className="px-4 py-2 border">
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
                  <td className="px-4 py-2 text-sm border">
                    {item.documentName}
                  </td>
                  <td className="px-4 py-2 text-sm border">
                    {item.documentDate
                      ? formatDate(item.documentDate.toString())
                      : ""}
                  </td>
                  <td className="px-4 py-2 text-sm border">
                    {item.documentValidDate && item.documentValidDate !== null
                      ? formatDate(item.documentValidDate.toString())
                      : ""}
                  </td>
                  <td className="px-4 py-2 text-sm border">
                    {item.keterangan}
                  </td>
                  {/*  <td className="px-4 py-2 text-sm border">{item.fileLink}</td> */}
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
          onClick={handleSubmitOnboard}
          type="submit"
          className="px-4 py-2 bg-green-800 hover:bg-green-500 text-white rounded-full shadow-lg"
        >
          Submit Data
        </button>
      </div>
      {showModal && (
        <ModalEditFilePendukung
          relasiId={rekrutmenId}
          id={idData}
          onClose={() => setShowModal(false)}
          onSubmit={() => handleSubmit("SAVE")}
        />
      )}
      {showDeleteModal && (
        <ModalDeleteData
          modelType="FILE PENDUKUNG"
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

export default FormFilePendukung;
