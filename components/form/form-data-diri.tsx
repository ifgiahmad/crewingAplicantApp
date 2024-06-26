/* eslint-disable @next/next/no-img-element */
import React from "react";
import CrewRekrutmen from "@/app/models/CrewRekrutmen";
import { useState, ChangeEvent, useEffect } from "react";
import DropdownKodeMaster from "../dropdown-list-kode-master";
import { constant } from "@/app/lib/helper";
import api from "@/app/lib/api";
import Image from "next/image";

import DatePicker from "react-datepicker";
import getApiUrl from "@/app/lib/apiHelper";
import { toast } from "sonner";
import Swal from "sweetalert2";
interface DataDiriFormProps {
  onNext: (id: number) => void;
  rekrutmenId: number;
  /* dataDiri: CrewRekrutmen;
  onChange: (data: CrewRekrutmen) => void;
  onNext: () => void; */
}

const FormDataDiri: React.FC<DataDiriFormProps> = ({ onNext, rekrutmenId }) => {
  const [rekrutmen, setCrewRekrutmen] = useState<CrewRekrutmen>(
    new CrewRekrutmen()
  );
  const [errors, setErrors] = useState<{ form?: string }>({});
  const [selectedFoto, setSelectedFoto] = useState<string | null>(null);
  const [selectedKTP, setSelectedKTP] = useState<string | null>(null);

  useEffect(() => {
    if (rekrutmenId > 0 && rekrutmen.id === 0) {
      getDataById(rekrutmenId);
    }
    console.log(rekrutmen);

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
    const apiUrl = getApiUrl();
    if (rekrutmen.fileLink && selectedFoto === null) {
      const _imgUrl =
        apiUrl?.substring(0, apiUrl.length - 1) +
        rekrutmen.fileLink.replaceAll("\\", "/");
      console.log(_imgUrl);
      setSelectedFoto(_imgUrl);
    }
    if (rekrutmen.fileLinkKTP && selectedKTP === null) {
      const _imgUrl =
        apiUrl?.substring(0, apiUrl.length - 1) +
        rekrutmen.fileLinkKTP.replaceAll("\\", "/");
      console.log(_imgUrl);
      setSelectedKTP(_imgUrl);
    }
  }, [rekrutmen, rekrutmenId, selectedFoto, selectedKTP]);

  /*   const getData = async () => {
    const response = await api.getDataIdNonAuth(
      rekrutmenId,
      constant.API_REKRUTMEN_GET_NON_AUTH
    );
    setCrewRekrutmen(response.data);
   
  }; */

  const handleDropdownChange = (name: string, value: string) => {
    setCrewRekrutmen((prevUser) => {
      return { ...prevUser, [name]: value } as CrewRekrutmen;
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    setCrewRekrutmen((prevUser) => {
      if (
        name === "tanggalLahir" ||
        name === "tglLahirPasangan" ||
        name === "tglLahirAnak1" ||
        name === "tglLahirAnak2" ||
        name === "tglLAhirAnak3"
      ) {
        return { ...prevUser, [name]: new Date(value) } as CrewRekrutmen;
      } else if ((name === "fotoKTP" || name === "fotoDiri") && files) {
        const foto = files[0];
        if (foto.size > 500 * 1024) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            foto: "Ukuran file maksimal adalah 500KB",
          }));
          return prevUser;
        } else {
          const reader = new FileReader();
          if (name === "fotoDiri") {
            reader.onloadend = () => {
              setSelectedFoto(reader.result as string);
            };
          } else {
            reader.onloadend = () => {
              setSelectedKTP(reader.result as string);
            };
          }
          reader.readAsDataURL(foto);
          setErrors((prevErrors) => ({ ...prevErrors, foto: undefined }));
          return { ...prevUser, [name]: foto } as CrewRekrutmen;
        }
      } else if (name === "jenisKelamin" || name === "agama") {
        return { ...prevUser, [name]: value } as CrewRekrutmen;
      } else {
        return { ...prevUser, [name]: value } as CrewRekrutmen;
      }
    });
  };

  const handleDateChange = (name: string, date: Date) => {
    setCrewRekrutmen((prevUser) => {
      return { ...prevUser, [name]: date } as CrewRekrutmen;
    });
  };
  const handleSubmit = async () => {
    try {
      const ret = await api.postNonAuth(
        rekrutmen,
        constant.API_REKRUTMEN_SAVE_NON_AUTH
      );
      if (!ret.status) {
        //throw new Error("Failed to save data");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal Menyimpan Data",
        });
      } else {
        rekrutmenId = ret.data.returnId;
        if (rekrutmen.fotoDiri != null || rekrutmen.fotoKTP != null) {
          let isSuccessFile = true;
          if (rekrutmen.fotoDiri != null) {
            const formDataFile = new FormData();
            formDataFile.append("file", rekrutmen.fotoDiri);
            formDataFile.append("Id", ret.data.returnId);
            formDataFile.append("menu", "REKRUTMEN");
            formDataFile.append("type", "PHOTO");

            const dataFile = Object.fromEntries(formDataFile.entries());

            const retFileFoto = await api.postFotoNonAuth(
              dataFile,
              constant.API_REKRUTMEN_SAVEPHOTO_NON_AUTH
            );
            if (!retFileFoto.data.status) {
              isSuccessFile = false;
            }
          }
          if (isSuccessFile) {
            if (rekrutmen.fotoKTP) {
              const formDataFile = new FormData();
              formDataFile.append("file", rekrutmen.fotoKTP);
              formDataFile.append("Id", ret.data.returnId);
              formDataFile.append("menu", "REKRUTMEN");
              formDataFile.append("type", "KTP");

              const dataFile = Object.fromEntries(formDataFile.entries());
              const retFileKTP = await api.postFotoNonAuth(
                dataFile,
                constant.API_REKRUTMEN_SAVEPHOTO_NON_AUTH
              );
              if (retFileKTP.data.status) {
                onNext(ret.data.returnId);
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Gagal Upload KTP",
                });
              }
            } else {
              onNext(ret.data.returnId);
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Gagal Upload Foto Diri",
            });
          }
        } else {
          if (rekrutmen.fileLink != "" && rekrutmen.fileLinkKTP != "") {
            onNext(ret.data.returnId);
          } else {
            toast.error("Foto diri dan KTP wajib diupload");
          }
        }
        //onNext(ret.data.returnId);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Server Error",
      });
      console.error("Error saving data:", error);
    }
  };

  return (
    <div>
      <form action={handleSubmit}>
        <div
          className="container mx-auto p-4 min-h-screen bg-gray-100 flex flex-col overflow-y-auto"
          style={{ maxHeight: "80vh" }}
        >
          {/* Baris Pertama */}
          <div className="flex-1 bg-white flex items-center mb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <label
                    htmlFor="namaLengkap"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    id="namaLengkap"
                    value={rekrutmen.namaLengkap || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="tempatLahir"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    name="tempatLahir"
                    id="tempatLahir"
                    value={rekrutmen.tempatLahir || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="tanggalLahir"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Tanggal Lahir
                  </label>
                  <div>
                    <DatePicker
                      className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                      selected={rekrutmen.tanggalLahir}
                      onChange={(selectedDate: Date) => {
                        handleDateChange("tanggalLahir", selectedDate);
                      }}
                      dateFormat="dd/MM/yyyy"
                      required
                    />
                  </div>
                  {/*  <input
                    type="date"
                    name="tanggalLahir"
                    id="tanggalLahir"
                    value={
                      rekrutmen.tanggalLahir
                        ? new Date(rekrutmen.tanggalLahir)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                    required
                  /> */}
                </div>
                <div className="mb-2">
                  <DropdownKodeMaster
                    elementId="jenisKelamin"
                    labelValue="Jenis Kelamin"
                    constantApi={constant.MASTER_TYPE_GENDER}
                    required={true}
                    defaultValue={rekrutmen.jenisKelamin || ""}
                    onSelect={(value: string) => {
                      handleDropdownChange("jenisKelamin", value);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="email"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={handleChange}
                    value={rekrutmen.email || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="noTelepon"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Telp. / Hp.
                  </label>
                  <input
                    type="number"
                    name="noTelepon"
                    id="noTelepon"
                    onChange={handleChange}
                    value={rekrutmen.noTelepon || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                    required
                  />
                </div>
                <div className="mb-2">
                  <DropdownKodeMaster
                    elementId="agama"
                    labelValue="Agama"
                    constantApi={constant.MASTER_TYPE_RELIGION}
                    required={false}
                    defaultValue={rekrutmen.agama || ""}
                    onSelect={(value: string) => {
                      handleDropdownChange("agama", value);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="suku"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    Suku
                  </label>
                  <input
                    type="text"
                    name="suku"
                    id="suku"
                    onChange={handleChange}
                    value={rekrutmen.suku || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="golonganDarah"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    GolonganDarah
                  </label>
                  <input
                    type="text"
                    name="golonganDarah"
                    id="golonganDarah"
                    onChange={handleChange}
                    value={rekrutmen.golonganDarah || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <DropdownKodeMaster
                    elementId="appliedPositon"
                    labelValue="Posisi Yang Ingin Dilamar"
                    constantApi={constant.MASTER_TYPE_CREW_LVL}
                    required={true}
                    defaultValue={rekrutmen.appliedPosition || ""}
                    onSelect={(value: string) => {
                      handleDropdownChange("appliedPosition", value);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="silverCode"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Kode Pelaut
                  </label>
                  <input
                    type="text"
                    name="silverCode"
                    id="silverCode"
                    onChange={handleChange}
                    value={rekrutmen.silverCode || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="nomorKartuKeluarga"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Nomor Kartu Keluarga
                  </label>
                  <input
                    type="text"
                    name="nomorKartuKeluarga"
                    id="nomorKartuKeluarga"
                    onChange={handleChange}
                    value={rekrutmen.nomorKartuKeluarga || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="nomorKTP"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Nomor KTP
                  </label>
                  <input
                    type="text"
                    name="nomorKTP"
                    id="nomorKTP"
                    onChange={handleChange}
                    value={rekrutmen.nomorKTP || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="alamatDiKTP"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Alamat KTP
                  </label>
                  <input
                    type="text"
                    name="alamatDiKTP"
                    id="alamatDiKTP"
                    onChange={handleChange}
                    value={rekrutmen.alamatDiKTP || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="kotaDiKTP"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Kota Di KTP
                  </label>
                  <input
                    type="text"
                    name="kotaDiKTP"
                    id="kotaDiKTP"
                    onChange={handleChange}
                    value={rekrutmen.kotaDiKTP || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                    required
                  />
                </div>
                <div className="mb-2">
                  <DropdownKodeMaster
                    elementId="namaBank"
                    labelValue="Bank"
                    constantApi={constant.MASTER_TYPE_BANK}
                    required={false}
                    defaultValue={rekrutmen.namaBank || ""}
                    onSelect={(value: string) => {
                      handleDropdownChange("namaBank", value);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="noRekening"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    No Rekening
                  </label>
                  <input
                    type="text"
                    name="noRekening"
                    id="noRekening"
                    onChange={handleChange}
                    value={rekrutmen.noRekening || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="namaPemilikRekening"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Nama Pemilik Rekening
                  </label>
                  <input
                    type="text"
                    name="namaPemilikRekening"
                    id="namaPemilikRekening"
                    onChange={handleChange}
                    value={rekrutmen.namaPemilikRekening || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <label
                    htmlFor="npwp"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    NPWP
                  </label>
                  <input
                    type="text"
                    name="npwp"
                    id="npwp"
                    onChange={handleChange}
                    value={rekrutmen.npwp || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                  />
                </div>
                <div className="mb-2">
                  <DropdownKodeMaster
                    elementId="statusPajak"
                    labelValue="Status Pernikahan"
                    constantApi={constant.MASTER_TYPE_TAX_STATUS}
                    required={false}
                    defaultValue={rekrutmen.statusPajak || ""}
                    onSelect={(value: string) => {
                      handleDropdownChange("statusPajak", value);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="bpjsKesehatan"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    BPJS Kesehatan
                  </label>
                  <input
                    type="text"
                    name="bpjsKesehatan"
                    id="bpjsKesehatan"
                    onChange={handleChange}
                    value={rekrutmen.bpjsKesehatan || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="bpjstk"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    BPJS TK
                  </label>
                  <input
                    type="text"
                    name="bpjstk"
                    id="bpjstk"
                    onChange={handleChange}
                    value={rekrutmen.bpjstk || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                  />
                </div>
                {/* <div className="bg-white rounded-sm shadow p-8 mb-2">
                  <label htmlFor="FotoDiri">Foto Diri:</label>
                  <input
                    type="file"
                    name="fotoDiri"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div> */}
                <div className="bg-white rounded-sm shadow p-8 mb-2">
                  {selectedFoto && (
                    <div className="mt-4 mb-3">
                      {/* <Image
                        src={selectedFoto}
                        alt="Selected Preview"
                        width={160} // Set your preferred width
                        height={0} // Set your preferred height
                        className="rounded-lg shadow-md"
                      /> */}
                      <img
                        src={selectedFoto}
                        alt="Selected Preview"
                        width={160} // Set your preferred width
                        height={0} // Set your preferred height
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  <label
                    htmlFor="file-upload-foto"
                    className="cursor-pointer bg-yellow-600 text-white px-3 py-1 rounded-lg shadow-lg tracking-wide border border-green-800 hover:bg-yellow-400"
                  >
                    Upload Foto Diri
                  </label>
                  <input
                    id="file-upload-foto"
                    type="file"
                    name="fotoDiri"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>
                <div className="bg-white rounded-sm shadow p-8 mb-2">
                  {selectedKTP && (
                    <div className="mt-4 mb-3">
                      {/*  <Image
                        src={selectedKTP}
                        alt="Selected Preview"
                        width={160} // Set your preferred width
                        height={0} // Set your preferred height
                        className="rounded-lg shadow-md"
                      /> */}
                      <img
                        src={selectedKTP}
                        alt="Selected Preview"
                        width={160} // Set your preferred width
                        height={0} // Set your preferred height
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  <label
                    htmlFor="file-upload-ktp"
                    className="cursor-pointer bg-yellow-600 text-white px-3 py-1 rounded-lg shadow-lg tracking-wide border border-green-800 hover:bg-yellow-400"
                  >
                    Upload Foto KTP
                  </label>
                  <input
                    id="file-upload-ktp"
                    type="file"
                    name="fotoKTP"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Baris Kedua - data keluarga */}
          <div className="flex-1 bg-white mb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <label
                    htmlFor="namaAyahKandung"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Nama Ayah Kandung
                  </label>
                  <input
                    type="text"
                    name="namaAyahKandung"
                    id="namaAyahKandung"
                    value={rekrutmen.namaAyahKandung || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    required
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <label
                    htmlFor="namaIbuKandung"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Nama Ibu Kandung
                  </label>
                  <input
                    type="text"
                    name="namaIbuKandung"
                    id="namaIbuKandung"
                    value={rekrutmen.namaIbuKandung || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    required
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md"></div>
            </div>
          </div>
          {/* Baris Ketiga - data Pasangan */}
          <div className="flex-1 bg-white mb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <label
                    htmlFor="namaPasangan"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    Nama Suami / Istri
                  </label>
                  <input
                    type="text"
                    name="namaPasangan"
                    id="namaPasangan"
                    value={rekrutmen.namaPasangan || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <label
                    htmlFor="tglLahirPasangan"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    Tgl. Lahir Suami / Istri
                  </label>
                  <div>
                    <DatePicker
                      className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                      selected={rekrutmen.tglLahirPasangan}
                      onChange={(selectedDate: Date) => {
                        handleDateChange("tglLahirPasangan", selectedDate);
                      }}
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md"></div>
            </div>
          </div>
          {/* Baris Keempat - data Anak */}
          <div className="flex-1 bg-white mb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <label
                    htmlFor="namaAnak1"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    Nama Anak 1
                  </label>
                  <input
                    type="text"
                    name="namaAnak1"
                    id="namaAnak1"
                    value={rekrutmen.namaAnak1 || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="namaAnak2"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    Nama Anak 2
                  </label>
                  <input
                    type="text"
                    name="namaAnak2"
                    id="namaAnak2"
                    value={rekrutmen.namaAnak2 || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="namaAnak3"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    Nama Anak 3
                  </label>
                  <input
                    type="text"
                    name="namaAnak3"
                    id="namaAnak3"
                    value={rekrutmen.namaAnak3 || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <label
                    htmlFor="tglLahirAnak1"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    Tgl. Lahir Anak 1
                  </label>
                  <div>
                    <DatePicker
                      className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                      selected={rekrutmen.tglLahirAnak1}
                      onChange={(selectedDate: Date) => {
                        handleDateChange("tglLahirAnak1", selectedDate);
                      }}
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="tglLahirAnak2"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    Tgl. Lahir Anak 2
                  </label>
                  <DatePicker
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    selected={rekrutmen.tglLahirAnak2}
                    onChange={(selectedDate: Date) => {
                      handleDateChange("tglLahirAnak2", selectedDate);
                    }}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="tglLahirAnak3"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    Tgl. Lahir Anak 3
                  </label>
                  <DatePicker
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    selected={rekrutmen.tglLahirAnak3 || null}
                    onChange={(selectedDate: Date) => {
                      handleDateChange("tglLahirAnak3", selectedDate);
                    }}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <label
                    htmlFor="pendidikanAnak1"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    Pendidikan Anak 1
                  </label>
                  <input
                    type="text"
                    name="pendidikanAnak1"
                    id="pendidikanAnak1"
                    value={rekrutmen.pendidikanAnak1 || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="pendidikanAnak2"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    Pendidikan Anak 2
                  </label>
                  <input
                    type="text"
                    name="pendidikanAnak2"
                    id="pendidikanAnak2"
                    value={rekrutmen.pendidikanAnak2 || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="pendidikanAnak3"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    Pendidikan Anak 3
                  </label>
                  <input
                    type="text"
                    name="pendidikanAnak3"
                    id="pendidikanAnak3"
                    value={rekrutmen.pendidikanAnak3 || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Baris Kelima - data Kontak Darurat */}
          <div className="flex-1 bg-white mb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <label
                    htmlFor="namaKontakDarurat"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Nama Kontak Darurat
                  </label>
                  <input
                    type="text"
                    name="namaKontakDarurat"
                    id="namaKontakDarurat"
                    value={rekrutmen.namaKontakDarurat || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="namaKontakDarurat2"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Nama Kontak Darurat 2
                  </label>
                  <input
                    type="text"
                    name="namaKontakDarurat2"
                    id="namaKontakDarurat2"
                    value={rekrutmen.namaKontakDarurat2 || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    required
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <label
                    htmlFor="hubunganKontakDarurat"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Hubungan Kontak Darurat
                  </label>
                  <input
                    type="text"
                    name="hubunganKontakDarurat"
                    id="hubunganKontakDarurat"
                    value={rekrutmen.hubunganKontakDarurat || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="hubunganKontakDarurat2"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    Hubungan Kontak Darurat 2
                  </label>
                  <input
                    type="text"
                    name="hubunganKontakDarurat2"
                    id="hubunganKontakDarurat2"
                    value={rekrutmen.hubunganKontakDarurat2 || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    required
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <label
                    htmlFor="noTelpKontakDarurat"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    No. Telp. Kontak Darurat
                  </label>
                  <input
                    type="number"
                    name="noTelpKontakDarurat"
                    id="noTelpKontakDarurat"
                    onChange={handleChange}
                    value={rekrutmen.noTelpKontakDarurat || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="noTelpKontakDarurat2"
                    className="block text-xs font-small text-gray-900 mb-1"
                  >
                    <sup>* </sup>
                    No. Telp. Kontak Darurat 2
                  </label>
                  <input
                    type="number"
                    name="noTelpKontakDarurat2"
                    id="noTelpKontakDarurat2"
                    onChange={handleChange}
                    value={rekrutmen.noTelpKontakDarurat2 || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                    placeholder=""
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Submit */}

        <div className="flex-1 bg-white flex items-center justify-end right-4 mb-2 p-3 rounded-lg shadow-md space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-green-800 hover:bg-green-500 text-white rounded-full shadow-lg"
          >
            Simpan & Lanjutkan
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormDataDiri;
