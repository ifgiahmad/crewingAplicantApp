"use client";
import Dropdown from "./dropdown-list";
import { useState } from "react";
import Modal from "./modal-confirmation";
import LoadingSpinner from "./loading";
import api from "@/app/lib/api";
import { constant } from "@/app/lib/helper";
import ModalViewDokumen from "./modal/modal-view-dokumen";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const ApplyForm = () => {
  const [selectedOptionKapal, setSelectedOptionKapal] = useState("");
  const [showInputKapal, setShowInputKapal] = useState<boolean>(false);
  const [inputValueKapal, setInputValueKapal] = useState<string>("");
  const [inputValueFileName, setInputValueFileName] = useState<string>("");
  const [selectedOptionSertifikat, setSelectedOptionSertifikat] = useState("");
  const [showInputSertifikat, setShowInputSertifikat] =
    useState<boolean>(false);
  const [inputValueSertifikat, setInputValueSertifikat] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalPositionApplied, setModalPositionApplied] = useState<string>("");
  const [modalSuccess, setModalSuccess] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputValueKTP, setInputValueKTP] = useState<string>("");
  const [inputValueKodePelaut, setInputValueKodePelaut] = useState<string>("");
  const [aktif, setAktif] = useState<boolean>(true);

  const router = useRouter();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (selectedFile.size > 2000000) {
        setErrorMessage(
          `File size should not exceed ${2000000 / 1024 / 1024} MB.`
        );
        setFile(null);
      } else {
        setFile(selectedFile);
        setInputValueFileName(selectedFile.name);
        setErrorMessage(null);
      }
    }
  };

  const handleKTP = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 16) {
      setInputValueKTP(e.target.value);
      setAktif(true);
    }
  };

  const handleKodePelaut = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 10) {
      setInputValueKodePelaut(e.target.value);
    }
  };

  const viewFile = () => {
    setShowModal(true);
  };

  const handleDropdownKapal = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOptionKapal(value);
    // Tampilkan input jika pilihan yang dipilih bukan default
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

  const handleInputChangeKapal = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputValueKapal(event.target.value.toUpperCase());
  };

  const handleInputChangeSertifikat = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputValueSertifikat(event.target.value.toUpperCase());
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const okeModal = () => {
    setModalOpen(false);
    router.refresh();
  };

  const saveApply = async (formData: FormData) => {
    const entries = Array.from(formData.entries());
    //const data: { [key: string]: string } = {};
    let data: { [key: string]: string | File | boolean } = {};

    for (let [key, value] of entries) {
      if (typeof value === "string") {
        // Memastikan value adalah string
        if (key !== "Email" && key !== "Aktif") {
          data[key] = value.toUpperCase();
        } else {
          //data[key] = value;
          if (key === "Aktif") {
            data[key] = true; // Assign string 'true' or 'false' based on condition
          } else {
            data[key] = value;
          }
        }
      } else if (value instanceof File) {
        // Memastikan value adalah File
        data[key] = value;
      }
    }

    if (inputValueKTP.length !== 16 || inputValueKodePelaut.length !== 10) {
      toast.error("Panjang KTP Harus 16 dan Panjang Kode Pelaut harus 10");
    } else {
      setIsLoading(true);
      //const data = Object.fromEntries(formData.entries());
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
          const ret = await api.postApplicant(
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
                Swal.fire({
                  icon: "success",
                  title: "Berhasil menyimpan data",
                  confirmButtonText: "Selesai",
                  text: "Terima kasih, Kami akan segera memproses lamaran sudara dan memberikan informasi lebih lanjut. Klik Selesai untuk menyelesaikan pendaftaran.",
                }).then((result) => {
                  if (result.isConfirmed) {
                    router.push("https://www.google.com/");
                  }
                });
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
          //setModalOpen(true);
        }
      }
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {isLoading && (
        <div>
          <LoadingSpinner />
        </div>
      )}
      <div
        className=" bg-white p-8 rounded-md shadow-md overflow-y-auto"
        style={{ maxHeight: "80vh" }}
      >
        <div className=" bg-green-800 mb-2 p-2 rounded-md shadow-md text-center text-lg text-white uppercase">
          Form Pendaftaran Crew
        </div>
        {/*   <h3 className="mb-3 text-center">Form Pendaftaran Crew</h3> */}
        <form action={saveApply}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-2">
                <label
                  htmlFor="NomorKTP"
                  className="block text-xs font-small text-gray-900 mb-1"
                >
                  <sup>* </sup>
                  Nomor KTP
                </label>
                <input
                  type="number"
                  name="NomorKTP"
                  id="NomorKTP"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  placeholder="Contoh: 3211xxxxxxxxxxxx (panjang 16 karakter)"
                  onChange={handleKTP}
                  value={inputValueKTP}
                  required
                />
                <input type="hidden" name="Aktif" value="true" />
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
                  name="NamaLengkap"
                  id="NamaLengkap"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 uppercase"
                  placeholder="Nama Lengkap"
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
                  name="NoTelepon"
                  id="NoTelepon"
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
                  name="Email"
                  id="Email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  placeholder="Contoh: xxxx@domain.com"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="Tempat Lahir"
                  className="block text-xs font-small text-gray-900 mb-1"
                >
                  <sup>* </sup>
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  name="TempatLahir"
                  id="TempatLahir"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 uppercase"
                  placeholder="Tempat Lahir"
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="TanggalLahir"
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
                  htmlFor="Domisili"
                  className="block text-xs font-small text-gray-900 mb-1"
                >
                  Domisili
                </label>
                <input
                  type="text"
                  name="Domisili"
                  id="Domisili"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 uppercase"
                  placeholder="Kota saat ini"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-2">
                <label
                  htmlFor="SilverCode"
                  className="block text-xs font-small text-gray-900 mb-1"
                >
                  <sup>* </sup>
                  Kode Pelaut
                </label>
                <input
                  type="number"
                  name="SilverCode"
                  id="SilverCode"
                  value={inputValueKodePelaut}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
                  placeholder="Kode pelaut (panjang 10 Karakter) "
                  required
                  onChange={handleKodePelaut}
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
              {showInputKapal && (
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
              )}
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
              {showInputSertifikat && (
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
              )}
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

export default ApplyForm;
