import { useState } from "react";

interface DataDiri {
  nama: string;
  alamat: string;
}

const DataDiriForm: React.FC<{ onNext: (data: DataDiri) => void }> = ({
  onNext,
}) => {
  const [dataDiri, setDataDiri] = useState<DataDiri>({ nama: "", alamat: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataDiri({ ...dataDiri, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simpan data ke database dan dapatkan ID
    // Misal: const id = saveDataDiri(dataDiri);
    const id = 1; // Ganti dengan ID yang didapat dari database
    onNext(dataDiri);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Form Data Diri</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nama</label>
          <input
            type="text"
            name="nama"
            value={dataDiri.nama}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Alamat</label>
          <input
            type="text"
            name="alamat"
            value={dataDiri.alamat}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Lanjutkan
        </button>
      </form>
    </div>
  );
};

export default DataDiriForm;
