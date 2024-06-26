import React from "react";
import { useState } from "react";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOke: () => void;
  title: string;
  message: string;
  position: string;
  success: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onOke,
  title,
  message,
  position,
  success,
}) => {
  useState<boolean>(false);
  console.log(position);
  if (!isOpen) return null;

  if (success) {
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-6 z-10 ">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="mb-1">{message}</p>
        {success ? (
          <div>
            <p className="mb-3">Saudara melamar untuk posisi {position}</p>
            <p className="mb-3">
              Klik button Oke untuk menyelesaikan pendaftaran
            </p>
            <div className="row-">
              <button
                onClick={onOke}
                className="bg-green-900 text-white py-2 px-4 rounded hover:bg-green-700 flex justify-end"
              >
                Oke
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-300 flex justify-end"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
