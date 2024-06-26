import React, { useState } from "react";

interface Pendidikan {
  id: number;
  tingkat: string;
  institusi: string;
}

const PendidikanTable: React.FC<{ onNext: () => void; onPrev: () => void }> = ({
  onNext,
  onPrev,
}) => {
  const [pendidikan, setPendidikan] = useState<Pendidikan[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newPendidikan, setNewPendidikan] = useState({
    tingkat: "",
    institusi: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPendidikan({ ...newPendidikan, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setPendidikan([
      ...pendidikan,
      { id: pendidikan.length + 1, ...newPendidikan },
    ]);
    setIsOpen(false);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Pendidikan</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Tingkat</th>
            <th className="py-2">Institusi</th>
          </tr>
        </thead>
        <tbody>
          {pendidikan.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.tingkat}</td>
              <td className="border px-4 py-2">{p.institusi}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 bg-blue-500 text-white px-4 py-2"
      >
        Tambah Pendidikan
      </button>

      <div className="mt-4">
        <button
          onClick={onPrev}
          className="bg-gray-500 text-white px-4 py-2 mr-2"
        >
          Sebelumnya
        </button>
        <button onClick={onNext} className="bg-blue-500 text-white px-4 py-2">
          Lanjutkan
        </button>
      </div>
    </div>
  );
};

export default PendidikanTable;
