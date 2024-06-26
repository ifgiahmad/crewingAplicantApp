import { useState, useEffect } from "react";
import MsEmployeeCertificates from "@/app/models/MsEmployeeCertificate";
import api from "@/app/lib/api";
import { constant, formatDate } from "@/app/lib/helper";
import {
  IoEyeSharp,
  IoPencil,
  IoPencilSharp,
  IoTrashOutline,
  IoTrashSharp,
} from "react-icons/io5";
//import ModalEditSertifikat from "../modal/modal-edit-Sertifikat";
import { Toaster, toast } from "sonner";
import ModalEditSertifikat from "../modal/modal-edit-sertifikat";
import ModalDeleteData from "../modal/modal-delete-data";
import ModalViewDokumen from "../modal/modal-view-dokumen";
import CrewRekrutmen from "@/app/models/CrewRekrutmen";
import NoteParagraph from "../tools/noteParagraph";

interface FormSertifikatProps {
  onNext: (id: number) => void;
  onPrevious: (id: number) => void;
  rekrutmenId: number;
}

const FormSertifikat: React.FC<FormSertifikatProps> = ({
  onNext,
  onPrevious,
  rekrutmenId,
}) => {
  const [listSertifikat, setListSertifikat] = useState<
    MsEmployeeCertificates[]
  >([]);
  const [rekrutmen, setCrewRekrutmen] = useState<CrewRekrutmen>(
    new CrewRekrutmen()
  );
  const [showModal, setShowModal] = useState(false);
  const [idData, setIdData] = useState(0);
  const [typeDoc, setTypeDoc] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewDocModal, setShowViewDocModal] = useState(false);
  const [fileLink, setFileLink] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");

  const noteAFF: String = `\n * Sertifikat AFF - Advanced Fire Fighting ( Format .pdf).`;
  const noteBST: String = `\n * Sertifikat BST - Basic Safety Training ( Format .pdf).`;
  const noteORU: String = `\n * Sertifikat ORU - Sertifikat Keahlian Operator RADIO GMDSS (Format .pdf).`;
  const noteSCRB: String = `\n * Sertifikat SCRB - Proficiency in Survival Craft And Rescue Boats (Format .pdf).`;

  const handleOpenModal = (id: number, typeDoc: string) => {
    setShowModal(true);
    setIdData(id);
    setTypeDoc(typeDoc);
  };

  const handleDeleteModal = (id: number) => {
    setShowDeleteModal(true);
    setIdData(id);
  };

  const handleNext = async () => {
    onNext(rekrutmenId);
  };

  const handleViewDocModal = (fileLink: string) => {
    setShowViewDocModal(true);
    setFileLink(fileLink);
  };

  const handlePrevious = async () => {
    onPrevious(rekrutmenId);
  };

  useEffect(() => {
    if (rekrutmenId > 0) {
      getListData();
    }

    if (rekrutmenId > 0 && rekrutmen.id === 0) {
      getDataById(rekrutmenId);
    }

    async function getDataById(Id: number) {
      try {
        const response = await api.getDataIdNonAuth(
          rekrutmenId,
          constant.API_REKRUTMEN_GET_NON_AUTH
        );
        setCrewRekrutmen(response.data);
      } catch (err) {
        toast.error("Gagal mengambil data rekrutmen");
        console.error(err);
      }
    }

    /* async function getListData() {
      try {
        const data = await api.getListDataById(
          rekrutmenId,
          constant.API_REKRUTMEN_LIST_CERTIFICATES_ID_NON_AUTH,
          "REKRUTMEN"
        );
        const listSertifikat = data.data.map(
          (item: any) =>
            new MsEmployeeCertificates(
              item.id,
              item.employeeId,
              item.rekrutmenId,
              item.certificateName,
              item.certificateNo,
              item.issuers,
              item.certificateDate,
              item.certificateValidTo,
              item.createdBy,
              item.createdTime,
              item.modifiedBy,
              item.modifiedTime,
              item.aktif,
              item.fileName,
              item.fIlePath,
              item.fileLink,
              item.docType,
              item.docCategory,
              item.keterangan
            )
        );
        setListSertifikat(listSertifikat);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } */

    let _note = " Berikut ini beberapa dokumen yang wajib anda upload :";
    _note += noteAFF;
    _note += noteBST;
    console.log(rekrutmen.appliedPosition);
    if (
      rekrutmen.appliedPosition == "NAKHODA" ||
      rekrutmen.appliedPosition == "MUALIM I" ||
      rekrutmen.appliedPosition == "MUALIM II" ||
      rekrutmen.appliedPosition == "MUALIM III" ||
      rekrutmen.appliedPosition == "KKM"
    ) {
      _note += noteORU;
      //"\n * Sertifikat ORU - Sertifikat Keahlian Operator RADIO GMDSS (Format .pdf).";
    }

    if (rekrutmen.appliedPosition == "NAKHODA") {
      _note += noteSCRB;
      //"\n * Sertifikat SCRB - Proficiency in Survival Craft And Rescue Boats (Format .pdf).";
    }

    //_note = _note.replace("\n", "<br>");
    console.log(_note);
    console.log(_note.split("\n").filter((line) => line.trim() !== ""));

    setNote(_note);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    noteAFF,
    noteBST,
    noteORU,
    noteSCRB,
    rekrutmen.appliedPosition,
    rekrutmen.id,
    rekrutmenId,
  ]);

  const getListData = async () => {
    try {
      const data = await api.getListDataById(
        rekrutmenId,
        constant.API_REKRUTMEN_LIST_CERTIFICATES_ID_NON_AUTH,
        "REKRUTMEN"
      );
      const listSertifikat = data.data.map(
        (item: any) =>
          new MsEmployeeCertificates(
            item.id,
            item.employeeId,
            item.rekrutmenId,
            item.certificateName,
            item.certificateNo,
            item.issuers,
            item.certificateDate,
            item.certificateValidTo,
            item.createdBy,
            item.createdTime,
            item.modifiedBy,
            item.modifiedTime,
            item.aktif,
            item.fileName,
            item.fIlePath,
            item.fileLink,
            item.docType,
            item.docCategory,
            item.keterangan
          )
      );
      setListSertifikat(listSertifikat);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = (action: string) => {
    if (action === "SAVE") {
      setShowModal(false);
      toast.success("Sertifikat berhasil tersimpan");
    } else {
      setShowDeleteModal(false);
      toast.error("Sertifikat berhasil terhapus");
    }
    //useEffect;
    getListData();
  };

  return (
    <div>
      <div className=" p-4 bg-gray-100  overflow-x-auto max-h-screen">
        <div className=" bg-white mb-2 p-6 rounded-lg shadow-md  overflow-y-auto max-w-screen-xl">
          <h2 className="text-md mb-2 ml-2 font-bold">Travel Dokumen</h2>
          <table className="min-w-full bg-white border border-gray-200 p-4 ">
            <thead className="text-sm text-gray-700 uppercase bg-yellow-500 rounded-lg">
              <tr>
                <th className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleOpenModal(0, "Travel Document")}
                    className=" bottom-4 right-4 px-4 py-2  bg-green-800 hover:bg-green-500 text-white rounded-full shadow-lg"
                  >
                    Tambah Sertifikat
                  </button>
                </th>
                <th className="px-4 py-2 text-sm border">Nama Sertifikat</th>
                <th className="px-4 py-2 text-sm border">No Sertifikat</th>
                <th className="px-4 py-2 text-sm border">Tgl. Sertifikat</th>
                {/*  <th className="px-4 py-2 text-sm border">File</th> */}
                <th className="px-4 py-2 text-sm border">Dibuat Oleh</th>
                <th className="px-4 py-2 text-sm border">Dibuat Pada</th>
                <th className="px-4 py-2 text-sm border">Diubah Oleh</th>
                <th className="px-4 py-2 text-sm border">Diubah Pada</th>
              </tr>
            </thead>
            <tbody>
              {listSertifikat
                .filter((x) => x.docCategory == "Travel Document")
                .map((item, index) => (
                  <tr key={item.id} className="table-row">
                    <td className="px-4 py-2 text-sm border">
                      <button
                        onClick={() =>
                          handleOpenModal(item.id, "Travel Document")
                        }
                        className=" hover:bg-blue-600 border border-blue-500 rounded-sm p-1 ml-2"
                      >
                        <IoPencilSharp size={20} />
                      </button>{" "}
                      <button
                        onClick={() => handleDeleteModal(item.id)}
                        className="ml-2 rounded-sm p-1 border border-red-500 hover:bg-red-600"
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
                      {item.certificateName}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.certificateNo}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.certificateDate
                        ? formatDate(item.certificateDate.toString())
                        : ""}
                    </td>
                    {/* <td className="px-4 py-2 text-sm border">
                      {item.fileLink}
                    </td> */}
                    <td className="px-4 py-2 text-sm border">
                      {item.createdBy}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.createdTime
                        ? formatDate(item.createdTime.toString())
                        : ""}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.modifiedBy}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.modifiedTime
                        ? formatDate(item.modifiedTime.toString())
                        : ""}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className=" bg-white mb-2 p-6 rounded-lg shadow-md  overflow-y-auto max-w-screen-xl">
          <h2 className="text-md mb-2 ml-2 font-bold">
            Certificate Of Competency
          </h2>
          <table className="min-w-full bg-white border border-gray-200 p-4">
            <thead className="text-sm text-gray-700 uppercase bg-yellow-500 rounded-lg">
              <tr>
                <th className="px-4 py-2 border text-center">
                  <button
                    onClick={() =>
                      handleOpenModal(0, "Certificate Of Competency")
                    }
                    className=" bottom-4 right-4 px-4 py-2  bg-green-800 hover:bg-green-500 text-white rounded-full shadow-lg"
                  >
                    Tambah Sertifikat
                  </button>
                </th>
                <th className="px-4 py-2 text-sm border">Nama Sertifikat</th>
                <th className="px-4 py-2 text-sm border">No Sertifikat</th>
                <th className="px-4 py-2 text-sm border">Tgl. Sertifikat</th>
                {/* <th className="px-4 py-2 text-sm border">File</th> */}
                <th className="px-4 py-2 text-sm border">Dibuat Oleh</th>
                <th className="px-4 py-2 text-sm border">Dibuat Pada</th>
                <th className="px-4 py-2 text-sm border">Diubah Oleh</th>
                <th className="px-4 py-2 text-sm border">Diubah Pada</th>
              </tr>
            </thead>
            <tbody>
              {listSertifikat
                .filter((x) => x.docCategory == "Certificate Of Competency")
                .map((item, index) => (
                  <tr key={item.id} className="table-row">
                    <td className="px-4 py-2 text-sm border">
                      <button
                        onClick={() =>
                          handleOpenModal(item.id, "Certificate Of Competency")
                        }
                        //className=" bottom-4 right-4 px-3 py-1 ml-2 mt-1 mb-1 bg-orange-500 text-white rounded-full shadow-lg"
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
                      {item.certificateName}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.certificateNo}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.certificateDate
                        ? formatDate(item.certificateDate.toString())
                        : ""}
                    </td>
                    {/*  <td className="px-4 py-2 text-sm border">
                      {item.fileLink}
                    </td> */}
                    <td className="px-4 py-2 text-sm border">
                      {item.createdBy}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.createdTime
                        ? formatDate(item.createdTime.toString())
                        : ""}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.modifiedBy}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.modifiedTime
                        ? formatDate(item.modifiedTime.toString())
                        : ""}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className=" bg-white mb-2 p-6 rounded-lg shadow-md  overflow-y-auto max-w-screen-xl">
          <h2 className="text-md mb-2 ml-2 font-bold">
            Certificate Of Proficiency
          </h2>
          <div className=" bg-gray-300 mb-2 p-6 rounded-lg shadow-md  overflow-y-auto max-w-screen-xl">
            <NoteParagraph note={note} />
          </div>
          <table className="min-w-full bg-white border border-gray-200 p-4">
            <thead className="text-sm text-gray-700 uppercase bg-yellow-500 rounded-lg">
              <tr>
                <th className="px-4 py-2 border text-center">
                  <button
                    onClick={() =>
                      handleOpenModal(0, "Certificate Of Proficiency")
                    }
                    className=" bottom-4 right-4 px-4 py-2  bg-green-800 hover:bg-green-500 text-white rounded-full shadow-lg"
                  >
                    Tambah Sertifikat
                  </button>
                </th>
                <th className="px-4 py-2 text-sm border">Nama Sertifikat</th>
                <th className="px-4 py-2 text-sm border">No Sertifikat</th>
                <th className="px-4 py-2 text-sm border">Tgl. Sertifikat</th>
                {/* <th className="px-4 py-2 text-sm border">File</th> */}
                <th className="px-4 py-2 text-sm border">Dibuat Oleh</th>
                <th className="px-4 py-2 text-sm border">Dibuat Pada</th>
                <th className="px-4 py-2 text-sm border">Diubah Oleh</th>
                <th className="px-4 py-2 text-sm border">Diubah Pada</th>
              </tr>
            </thead>
            <tbody>
              {listSertifikat
                .filter((x) => x.docCategory == "Certificate Of Proficiency")
                .map((item, index) => (
                  <tr key={item.id} className="table-row">
                    <td className="px-4 py-2 text-sm border">
                      <button
                        onClick={() =>
                          handleOpenModal(item.id, "Certificate Of Proficiency")
                        }
                        //className=" bottom-4 right-4 px-3 py-1 ml-2 mt-1 mb-1 bg-orange-500 text-white rounded-full shadow-lg"
                        className=" hover:bg-blue-600 border border-blue-500 rounded-sm p-1 ml-2"
                      >
                        <IoPencilSharp size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteModal(item.id)}
                        //className=" bottom-4 right-4 px-3 py-1 mt-1 mb-1 bg-red-700 text-white rounded-full shadow-md"
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
                      {item.certificateName}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.certificateNo}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.certificateDate
                        ? formatDate(item.certificateDate.toString())
                        : ""}
                    </td>
                    {/*  <td className="px-4 py-2 text-sm border">
                      {item.fileLink}
                    </td> */}
                    <td className="px-4 py-2 text-sm border">
                      {item.createdBy}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.createdTime
                        ? formatDate(item.createdTime.toString())
                        : ""}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.modifiedBy}
                    </td>
                    <td className="px-4 py-2 text-sm border">
                      {item.modifiedTime
                        ? formatDate(item.modifiedTime.toString())
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
        <ModalEditSertifikat
          relasiId={rekrutmenId}
          Id={idData}
          onClose={() => setShowModal(false)}
          onSubmit={() => handleSubmit("SAVE")}
          typeDoc={typeDoc || ""}
        />
      )}
      {showDeleteModal && (
        <ModalDeleteData
          modelType="SERTIFIKAT"
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

export default FormSertifikat;
