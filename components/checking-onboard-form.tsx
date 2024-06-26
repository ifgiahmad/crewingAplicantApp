"use client";
import Image from "next/image";
import Dropdown from "@/components/dropdown-list";
import api from "@/app/lib/api";
import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import CrewRekrutmen from "@/app/models/CrewRekrutmen";
const CheckingOnboard: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [listCrew, setListCrew] = useState<CrewRekrutmen[]>([]);
  const [rekrutmen, setCrewRekrutmen] = useState<CrewRekrutmen>(
    new CrewRekrutmen()
  );
  const [inputValueKTP, setInputValueKTP] = useState<string>("");
  const [inputValueKodePelaut, setInputValueKodePelaut] = useState<string>("");

  useEffect(() => {
    // Ensure that the router is available in the client-side environment
    if (typeof window !== "undefined") {
      // Access the router here if needed
    }
  }, []);

  const handleKTP = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 16) {
      setInputValueKTP(e.target.value);
    }
  };

  const handleKodePelaut = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 10) {
      setInputValueKodePelaut(e.target.value);
    }
  };
  const checkingData = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    const crewOnboard = await api.getCrewRekrutmenListNonAuth(
      "ONBOARD",
      data.IdPelaut,
      data.Nama,
      data.Tanggal,
      data.NIK
    );

    const crewExisting = await api.getCrewRekrutmenListNonAuth(
      "ONBOARD_EXISTING",
      data.IdPelaut,
      data.Nama,
      data.Tanggal,
      data.NIK
    );
    const crewExistingResign = await api.getCrewRekrutmenListNonAuth(
      "ONBOARD_RESIGN",
      data.IdPelaut,
      data.Nama,
      data.Tanggal,
      data.NIK
    );
    const crewBlacklist = await api.getCrewRekrutmenListNonAuth(
      "BLACKLIST",
      data.IdPelaut,
      data.Nama,
      data.Tanggal,
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
      //let id = 0;
      if (crewOnboard && crewOnboard.length > 0) {
        const sortedData = crewOnboard.sort(
          (a: { id: number }, b: { id: number }) => a.id - b.id
        );
        setData(sortedData);
        // Ambil ID terakhir
        setLastId(sortedData[sortedData.length - 1].id);
        const id = sortedData[sortedData.length - 1].id;
        const idPelaut = sortedData[sortedData.length - 1].silverCode;
        const nik = sortedData[sortedData.length - 1].nomorKTP;
        console.log(id, idPelaut, nik);
        router.push(`/onboardchecking/onboard/${id}/${idPelaut}/${nik}`);
      } else {
        router.push(
          `/onboardchecking/onboard/${0}/${data.IdPelaut}/${data.NIK}`
        );
      }
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-md shadow-md">
        <div className=" bg-green-800 mb-2 p-2 rounded-md shadow-md text-center text-lg text-white uppercase">
          Onboard Checking
        </div>
        <form action={checkingData}>
          <div className="mb-2">
            <label
              htmlFor="NIK"
              className="block text-xs font-small text-gray-900 mb-1"
            >
              <sup>* </sup>
              Nomor KTP
            </label>
            <input
              type="number"
              name="NIK"
              id="NIK"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
              placeholder="Contoh: 3211xxxxxxxxxxxx (panjang 16 karakter)"
              onChange={handleKTP}
              value={inputValueKTP}
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="Nama"
              className="block text-xs font-small text-gray-900 mb-1"
            >
              <sup>* </sup>
              Nama Lengkap
            </label>
            <input
              type="text"
              name="Nama"
              id="Nama"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 uppercase"
              placeholder="Nama Lengkap"
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="Tanggal"
              className="block text-xs font-medium text-gray-900 mb-1"
            >
              <sup>* </sup>
              Tanggal Lahir
            </label>
            <input
              type="date"
              name="Tanggal"
              id="Tanggal"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
              placeholder="Tanggal Lahir"
              required
            />
          </div>
          {/* <div className="mb-2">
            <label
              htmlFor="IdPelaut"
              className="block text-xs font-small text-gray-900 mb-1"
            >
              <sup>* </sup>
              Kode Pelaut
            </label>
            <input
              type="number"
              name="IdPelaut"
              id="IdPelaut"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
              placeholder="Kode Pelaut"
              required
              minLength={10}
              maxLength={10}
            />
          </div> */}
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
              name="IdPelaut"
              id="IdPelaut"
              value={inputValueKodePelaut}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5"
              placeholder="Kode pelaut (panjang 10 Karakter) "
              required
              onChange={handleKodePelaut}
            />
          </div>
          <div className="mb-2">
            <Dropdown
              elementId="Posisi"
              labelName="Posisi Yang Ingin Dilamar"
            />
          </div>
          <div className="row-auto">
            <button
              type="submit"
              className="text-white bg-green-900 hover:bg-green-800 font-medium rounded text-xs w-full px-5 py-3 text-center"
            >
              Lanjutkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckingOnboard;
