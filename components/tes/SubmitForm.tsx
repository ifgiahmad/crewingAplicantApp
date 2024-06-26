import React from "react";

const SubmitForm: React.FC<{ onPrev: () => void }> = ({ onPrev }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Proses submit data
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Submit Pendaftaran</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Submit
        </button>
      </form>
      <button
        onClick={onPrev}
        className="mt-4 bg-gray-500 text-white px-4 py-2"
      >
        Sebelumnya
      </button>
    </div>
  );
};

export default SubmitForm;
