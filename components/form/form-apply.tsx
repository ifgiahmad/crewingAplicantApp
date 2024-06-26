"use client";
import Dropdown from "../dropdown-list";
import axios from "axios";
import CrewRekrutmen from "@/app/models/CrewRekrutmen";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Modal from "../modal-confirmation";
import LoadingSpinner from "../loading";
import api from "@/app/lib/api";
import { constant } from "@/app/lib/helper";
import ModalViewDokumen from "../modal/modal-view-dokumen";

const FormApply = () => {
  const [rekrutmen, setCrewRekrutmen] = useState<CrewRekrutmen>(
    new CrewRekrutmen()
  );
  const [selectedOptionKapal, setSelectedOptionKapal] = useState("");
  const [showInputKapal, setShowInputKapal] = useState<boolean>(false);
  const [selectedOptionSertifikat, setSelectedOptionSertifikat] = useState("");
  const [showInputSertifikat, setShowInputSertifikat] =
    useState<boolean>(false);
  const [inputValueSertifikat, setInputValueSertifikat] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalPositionApplied, setModalPositionApplied] = useState<string>("");
  const [modalSuccess, setModalSuccess] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputValueKTP, setInputValueKTP] = useState<string>("");
  const [inputValueKodePelaut, setInputValueKodePelaut] = useState<string>("");
  const [inputValueKapal, setInputValueKapal] = useState<string>("");
  const [inputValueFileName, setInputValueFileName] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setCrewRekrutmen((prevUser) => {
      if (name === "nomorKTP") {
        if (value.length <= 16) {
          rekrutmen.nomorKTP = value;
          return { ...prevUser, [name]: value.toUpperCase() } as CrewRekrutmen;
        } else {
          return prevUser;
        }
      } else if (name === "silverCode") {
        if (value.length <= 10) {
          return { ...prevUser, [name]: value.toUpperCase() } as CrewRekrutmen;
        } else {
          return prevUser;
        }
      } else {
        return { ...prevUser, [name]: value } as CrewRekrutmen;
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (selectedFile.size > 2000000) {
        setErrors(`File size should not exceed ${2000000 / 1024 / 1024} MB.`);
        setFile(null);
      } else {
        setFile(selectedFile);
        setInputValueFileName(selectedFile.name);
        setErrors("");
      }
    }
  };

  const viewFile = () => {
    setShowModal(true);
  };

  const handleDropdownKapal = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOptionKapal(value);
    setShowInputKapal(value == "OTHERS");
    if (value !== "OTHERS") {
      setInputValueKapal(value);
    }
  };

  const handleDropdownSertifikat = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedOptionSertifikat(value);
    // Tampilkan input jika pilihan yang dipilih bukan default
    setShowInputSertifikat(value == "OTHERS");
    if (value !== "OTHERS") {
      setInputValueSertifikat(value);
    }
  };

  /*  const handleInputChangeKapal = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputValueKapal(event.target.value);
  };

  const handleKTP = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value.length);
    if (e.target.value.length <= 16) {
      setInputValueKTP(e.target.value);
    }
  }; */

  /*   const handleInputChangeSertifikat = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputValueSertifikat(event.target.value);
  }; */

  interface CloseModal {
    success: boolean;
  }

  const closeModal = () => {
    setModalOpen(false);
  };

  const okeModal = () => {
    setModalOpen(false);
  };

  const saveApply = async (formData: FormData) => {
    setIsLoading(true);
    const data = Object.fromEntries(formData.entries());
    const crewOnboard = await api.getCrewRekrutmenListNonAuth(
      "ONBOARD",
      data.SilverCode,
      data.NamaLengkap,
      data.TanggalLahir,
      data.NIK
    );
    const crewExisting = await api.getCrewRekrutmenListNonAuth(
      "ONBOARD_EXISTING",
      data.SilverCode,
      data.NamaLengkap,
      data.TanggalLahir,
      data.NIK
    );
    const crewExistingResign = await api.getCrewRekrutmenListNonAuth(
      "ONBOARD_RESIGN",
      data.SilverCode,
      data.NamaLengkap,
      data.TanggalLahir,
      data.NIK
    );
    const crewBlacklist = await api.getCrewRekrutmenListNonAuth(
      "BLACKLIST",
      data.SilverCode,
      data.NamaLengkap,
      data.TanggalLahir,
      data.NIK
    );

    if (crewBlacklist.length > 0) {
      throw new Error(`Anda Sudah Di Blacklist Dari LMI Group`);
    } else if (
      crewOnboard.length > 0 &&
      crewExisting.length > 0 &&
      crewExistingResign.length == 0
    ) {
      throw new Error(
        `Anda sudah pernah menjadi Crew di LMI Group dan status anda di database kami masih Aktif, Silahkan hubungi Tim Crewing Rekrutmen LMI`
      );
    } else {
      try {
        const ret = await api.postNonAuth(
          data,
          constant.API_APPLICANT_SAVE_APPLICANT_NON_AUTH
        );
        if (ret.data.status === "OK") {
          const today = new Date().toISOString();
          const formDataFile = new FormData();
          formDataFile.append("DocumentName", "CV");
          formDataFile.append("FileCategory", "CV");
          formDataFile.append("RekrutmenId", ret.data.returnId);
          formDataFile.append("DocumentDate", today);
          const dataFile = Object.fromEntries(formDataFile.entries());
          console.log(dataFile);
          const retFile = await api.postNonAuth(
            dataFile,
            constant.API_APPLICANT_SAVE_OPTIONAL_FILE_NON_AUTH
          );
          if (retFile.data.status === "OK") {
            if (!file) return;
            const fileUpload = new FormData();
            fileUpload.append("file", file);
            fileUpload.append("optId", retFile.data.returnId);
            fileUpload.append("relasiId", ret.data.returnId);
            fileUpload.append("menuForm", "REKRUTMEN");
            const retUploadFile = await api.postDocNonAuth(
              fileUpload,
              constant.API_APPLICANT_SAVE_OPTIONAL_FILE_DOC_NON_AUTH
            );
            if (retUploadFile.data.status === "OK") {
              setModalTitle("Success");
              console.log(data.AppliedPosition.toString());
              setModalMessage("Lamaran saudara berhasil tersimpan.");
              setModalPositionApplied(data.AppliedPosition.toString());
              setModalOpen(true);
              setModalSuccess(true);
            }
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setModalTitle("Error");
        setModalMessage("Failed to save.");
        setModalSuccess(false);
      } finally {
        setIsLoading(false);
        setModalOpen(true);
      }
    }
  };

  return (
    <div className="bg-background-image flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {isLoading && (
        <div>
          <LoadingSpinner />
        </div>
      )}
      <div
        className=" bg-white p-8 rounded-md shadow-md overflow-y-auto"
        style={{ maxHeight: "80vh" }}
      >
        <h3 className="mb-3 text-center">Form Pendaftaran Crew</h3>
        <form action={saveApply}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
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
                  htmlFor="NamaLengkap"
                  className="block text-xs font-small text-gray-900 mb-1"
                >
                  <sup>* </sup>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="namaLengkap"
                  id="namaLengkap"
                  onChange={handleChange}
                  value={rekrutmen.namaLengkap || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  placeholder=""
                  required
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="NoTeleon"
                  className="block text-xs font-small text-gray-900 mb-1"
                >
                  <sup>* </sup>
                  No Telepon
                </label>
                <input
                  type="text"
                  pattern="[0-9]*"
                  name="noTelepon"
                  id="noTelepon"
                  onChange={handleChange}
                  value={rekrutmen.noTelepon || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  placeholder="Contoh: 08xxxxxxxx"
                  required
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="Email"
                  className="block text-xs font-small text-gray-900 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  value={rekrutmen.email || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  placeholder="Contoh: xxxx@domain.com"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="tempat Lahir"
                  className="block text-xs font-small text-gray-900 mb-1"
                >
                  <sup>* </sup>
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  name="tempatLahir"
                  id="tempatLahir"
                  onChange={handleChange}
                  value={rekrutmen.tempatLahir || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 uppercase"
                  placeholder="Tempat Lahir"
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
                <input
                  type="date"
                  name="TanggalLahir"
                  id="TanggalLahir"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  placeholder="Klik icon kalender untuk pilih tanggal lahir"
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="domisili"
                  className="block text-xs font-small text-gray-900 mb-1"
                >
                  Domisili
                </label>
                <input
                  type="text"
                  name="domisili"
                  id="domisili"
                  onChange={handleChange}
                  value={rekrutmen.domisili || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 uppercase"
                  placeholder="Kota saat ini"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-2">
                <label
                  htmlFor="silverCode"
                  className="block text-xs font-small text-gray-900 mb-1"
                >
                  <sup>* </sup>
                  Kode Pelaut
                </label>
                <input
                  type="number"
                  name="silverCode"
                  id="silverCode"
                  onChange={handleChange}
                  value={rekrutmen.silverCode || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  placeholder="Kode pelaut (panjang 10 Karakter) "
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="JenisKapalTerakhir"
                  className="block text-xs font-small text-gray-900 mb-1"
                >
                  <sup>* </sup>
                  Jenis Kapal Terakhir
                </label>
                <select
                  name="JenisKapalTerakhir"
                  id="JenisKapalTerakhir"
                  value={selectedOptionKapal}
                  onChange={handleDropdownKapal}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 rounded"
                  required
                >
                  <option value="">--Pilih Jenis Kapal Terakhir--</option>
                  <option value="BULK CARRIER">BULK CARRIER</option>
                  <option value="TUGBOAT">TUGBOAT</option>
                  <option value="TANKER">TANKER</option>
                  <option value="PASSENGER">PASSENGER</option>
                  <option value="CARGO">CARGO</option>
                  <option value="SPOB">SPOB</option>
                  <option value="CONTAINER">CONTAINER</option>
                  <option value="KKM">KKM</option>
                  <option value="RORO">RORO</option>
                  <option value="FLOATING CRANE">FLOATING CRANE</option>
                  <option value="OTHERS">OTHERS</option>
                </select>
              </div>
              {/*  {showInputKapal && (
                <div className="mb-2">
                  <input
                    type="text"
                    name="JenisKapalTerakhir"
                    id="JenisKapalTerakhir"
                    value={inputValueKapal}
                    onChange={handleInputChangeKapal}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 uppercase"
                    placeholder="Masukan Jenis Kapal Terakhir"
                    required
                  />
                </div>
              )} */}
              <div className="mb-2">
                <Dropdown
                  elementId="JabatanTerakhir"
                  labelName="Jabatan Terakhir"
                />
              </div>
              <div className="mb-2">
                <Dropdown
                  elementId="AppliedPosition"
                  labelName="Posisi Yang Ingin Dilamar"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="Pendidikan"
                  className="block text-xs font-small text-gray-900 mb-1"
                >
                  <sup>* </sup>
                  Sertifikat
                </label>
                <select
                  name="Pendidikan"
                  id="Pendidikan"
                  value={selectedOptionSertifikat}
                  onChange={handleDropdownSertifikat}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  required
                >
                  <option value="">
                    -- Sertifikat Pelaut Yang Anda Miliki --
                  </option>
                  <option value="AHLI NAUTIKA TINGKAT I">
                    AHLI NAUTIKA TINGKAT I
                  </option>
                  <option value="AHLI NAUTIKA TINGKAT II">
                    AHLI NAUTIKA TINGKAT II
                  </option>
                  <option value="AHLI NAUTIKA TINGKAT III - MANAJEMEN">
                    AHLI NAUTIKA TINGKAT III - MANAJEMEN
                  </option>
                  <option value="AHLI NAUTIKA TINGKAT IV - MANAJEMEN">
                    AHLI NAUTIKA TINGKAT IV - MANAJEMEN
                  </option>
                  <option value="AHLI NAUTIKA TINGKAT V - MANAJEMEN">
                    AHLI NAUTIKA TINGKAT V - MANAJEMEN
                  </option>
                  <option value="AHLI NAUTIKA TINGKAT III - OPERASIONAL">
                    AHLI NAUTIKA TINGKAT III - OPERASIONAL
                  </option>
                  <option value="AHLI NAUTIKA TINGKAT IV - OPERASIONAL">
                    AHLI NAUTIKA TINGKAT IV - OPERASIONAL
                  </option>
                  <option value="AHLI NAUTIKA TINGKAT V - OPERASIONAL">
                    AHLI NAUTIKA TINGKAT V - OPERASIONAL
                  </option>
                  <option value="AHLI TEHNIKA TINGKAT I">
                    AHLI TEHNIKA TINGKAT I
                  </option>
                  <option value="AHLI TEHNIKA TINGKAT II">
                    AHLI TEHNIKA TINGKAT II
                  </option>
                  <option value="AHLI TEHNIKA TINGKAT III - MANAJEMEN">
                    AHLI TEHNIKA TINGKAT III - MANAJEMEN
                  </option>
                  <option value="AHLI TEHNIKA TINGKAT IV - MANAJEMEN">
                    AHLI TEHNIKA TINGKAT IV - MANAJEMEN
                  </option>
                  <option value="AHLI TEHNIKA TINGKAT V - MANAJEMEN">
                    AHLI TEHNIKA TINGKAT V - MANAJEMEN
                  </option>
                  <option value="AHLI TEHNIKA TINGKAT III - OPERASIONAL">
                    AHLI TEHNIKA TINGKAT III - OPERASIONAL
                  </option>
                  <option value="AHLI TEHNIKA TINGKAT IV - OPERASIONAL">
                    AHLI TEHNIKA TINGKAT IV - OPERASIONAL
                  </option>
                  <option value="AHLI TEHNIKA TINGKAT V - OPERASIONAL">
                    AHLI TEHNIKA TINGKAT V - OPERASIONAL
                  </option>
                  <option value="RATING AS ABLE DECK">
                    RATING AS ABLE DECK
                  </option>
                  <option value="RATING AS ABLE SEAFARER ENGINE">
                    RATING AS ABLE SEAFARER ENGINE
                  </option>
                  <option value="OTHERS">OTHERS</option>
                </select>
              </div>
              {/* {showInputSertifikat && (
                <div className="mb-2">
                  <input
                    type="text"
                    name="Pendidikan"
                    id="Pendidikan"
                    value={inputValueSertifikat}
                    onChange={handleInputChangeSertifikat}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 uppercase"
                    placeholder="Masukan Sertifikat Kompetensi"
                    required
                  />
                </div>
              )} */}
              <div className="mb-2">
                <label>
                  <sup>* </sup>CV
                </label>
                <input
                  type="text"
                  name="fileName"
                  value={inputValueFileName}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  readOnly
                  placeholder="Klik button Upload File untuk upload surat sign off (format file .pdf)"
                />
              </div>
              <div className="mb-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
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
                {/* <label
                  htmlFor="File"
                  className="block text-xs font-small text-gray-900 mb-1"
                >
                  <sup>* </sup>
                  Upload CV
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  required
                /> */}
              </div>
              <div className="row-auto">
                <button
                  type="submit"
                  className="text-white bg-green-900 hover:bg-green-800 font-medium rounded text-xs w-full px-5 py-3 text-center"
                  disabled={isLoading}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        onOke={okeModal}
        title={modalTitle}
        message={modalMessage}
        position={modalPositionApplied}
        success={modalSuccess}
      />
      {showModal && (
        <ModalViewDokumen
          file={file}
          fileLink={""}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default FormApply;
