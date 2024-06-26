import api from "@/app/lib/api";
import { constant } from "@/app/lib/helper";
import OptionalFileRekrutmens from "@/app/models/OptionalFileRekrutmen";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import MsEmployeeEducations from "@/app/models/MsEmployeeEducation";
import CrewingLogs from "@/app/models/CrewingLog";
import MsEmployeeCertificates from "@/app/models/MsEmployeeCertificate";

interface DeleteModalProps {
  id: number;
  modelType: string;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalDeleteData: FC<DeleteModalProps> = ({
  id,
  modelType,
  onSubmit,
  onClose,
}) => {
  const [pendidikan, setPendidikan] = useState<MsEmployeeEducations>(
    new MsEmployeeEducations()
  );
  const [filePendukung, setFilePendukung] = useState<OptionalFileRekrutmens>(
    new OptionalFileRekrutmens()
  );
  const [sertifikat, setSertifikat] = useState<MsEmployeeCertificates>(
    new MsEmployeeCertificates()
  );
  const [riwayatPekerjaan, setRiwayatPekerjaan] = useState<CrewingLogs>(
    new CrewingLogs()
  );
  const [nameData, setNameData] = useState<string>();

  useEffect(() => {
    if (modelType === "PENDIDIKAN" && id > 0 && pendidikan.id === 0) {
      getDataById(
        id,
        modelType,
        constant.API_REKRUTMEN_GET_EDUCATION_ID_NON_AUTH
      );
    } else if (
      modelType === "RIWAYAT PEKERJAAN" &&
      id > 0 &&
      riwayatPekerjaan.id === 0
    ) {
      getDataById(
        id,
        modelType,
        constant.API_REKRUTMEN_GET_RIWAYAT_PEKERJAAN_ID_NON_AUTH
      );
    } else if (modelType === "SERTIFIKAT" && id > 0 && sertifikat.id === 0) {
      getDataById(
        id,
        modelType,
        constant.API_REKRUTMEN_GET_CERTIFICATE_ID_NON_AUTH
      );
    } else if (
      modelType === "FILE PENDUKUNG" &&
      id > 0 &&
      filePendukung.id === 0
    ) {
      getDataById(
        id,
        modelType,
        constant.API_REKRUTMEN_GET_OPTIONAL_FILE_ID_NON_AUTH
      );
    }
    async function getDataById(
      id: number,
      modelType: string,
      constantApi: string
    ) {
      try {
        if (modelType === "PENDIDIKAN") {
          const data = await api.getDataEducationId(id);
          setPendidikan(data);
          setNameData(pendidikan.pendidikan);
        } else if (modelType === "RIWAYAT PEKERJAAN") {
          const data = await api.getDataByIdNonAuth(id, constantApi);
          console.log(data);
          setRiwayatPekerjaan(data);
          setNameData(riwayatPekerjaan.kapal);
        } else if (modelType === "SERTIFIKAT") {
          const data = await api.getDataByIdNonAuth(id, constantApi);
          setSertifikat(data);
          setNameData(sertifikat.certificateName);
        } else if (modelType === "FILE PENDUKUNG") {
          const data = await api.getDataByIdNonAuth(id, constantApi);
          setFilePendukung(data);
          setNameData(filePendukung.documentName);
        }
      } catch (err) {
        toast.error("Gagal mengambil data " + modelType);
        console.error(err);
      }
    }
  }, [
    filePendukung.documentName,
    filePendukung.id,
    id,
    modelType,
    pendidikan.id,
    pendidikan.pendidikan,
    riwayatPekerjaan.id,
    riwayatPekerjaan.kapal,
    sertifikat.certificateName,
    sertifikat.id,
  ]);

  const handleSubmit = async () => {
    let statusSave = "";
    try {
      if (modelType === "PENDIDIKAN") {
        pendidikan.mode = "DELETE";
        const ret = await api.postNonAuth(
          pendidikan,
          constant.API_REKRUTMEN_SAVE_EDUCATION_NON_AUTH
        );
        statusSave = ret.data.status;
      } else if (modelType === "RIWAYAT PEKERJAAN") {
        riwayatPekerjaan.mode = "DELETE";
        const ret = await api.postNonAuth(
          riwayatPekerjaan,
          constant.API_REKRUTMEN_SAVE_RIWAYAT_NON_AUTH
        );
        statusSave = ret.data.status;
      } else if (modelType === "SERTIFIKAT") {
        sertifikat.mode = "DELETE";
        const ret = await api.postNonAuth(
          sertifikat,
          constant.API_REKRUTMEN_SAVE_CERTIFICATE_NON_AUTH
        );
        statusSave = ret.data.status;
      } else {
        filePendukung.mode = "DELETE";
        const ret = await api.postNonAuth(
          filePendukung,
          constant.API_REKRUTMEN_SAVE_OPTIONAL_FILE_NON_AUTH
        );
        statusSave = ret.data.status;
      }
      if (statusSave === "OK") {
        onSubmit();
      } else {
        toast.error("Gagal menghapus data " + nameData);
      }
    } catch (err) {
      toast.error("Error saving data:");
      console.error("Error saving data:", err);
    } finally {
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
            <h2 className="text-xl font-bold">
              Yakin menghapus data {nameData} ini ?
            </h2>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-200 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Ya
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>

    /*  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              Yakin menghapus data {nameData} ini ?
            </h2>
          </div>
          <div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-200 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Ya
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div> */
  );
};

export default ModalDeleteData;
