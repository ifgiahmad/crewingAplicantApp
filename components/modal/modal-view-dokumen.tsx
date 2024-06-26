import api from "@/app/lib/api";
import getApiUrl from "@/app/lib/apiHelper";
import { constant } from "@/app/lib/helper";
import OptionalFileRekrutmens from "@/app/models/OptionalFileRekrutmen";
import { FC, useEffect, useState } from "react";
import { createObjectURLFromLink } from "@/app/lib/helper";
import { toast } from "sonner";
import ModalEditFilePendukung from "./modal-edit-file-pendukung";
import axios from "axios";

interface PDFModalProps {
  file: File | null;
  fileLink: string | null;
  onClose: () => void;
}

const ModalViewDokumen: FC<PDFModalProps> = ({ file, fileLink, onClose }) => {
  const [ModalFilePendukung, setModalFilePendukung] =
    useState<OptionalFileRekrutmens>(new OptionalFileRekrutmens());
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      const apiUrl = getApiUrl();
      const fetchAndCreateObjectURL = async () => {
        try {
          if (!fileLink) return;
          // eslint-disable-next-line react-hooks/exhaustive-deps
          fileLink = fileLink.replaceAll("\\", "/");
          const _pdfUrl = apiUrl?.substring(0, apiUrl.length - 1) + fileLink;
          setPdfUrl(_pdfUrl);
        } catch (error) {
          console.error("Failed to create object URL:", error);
        }
      };

      fetchAndCreateObjectURL();
      return () => {
        if (pdfUrl) {
          console.log("Fetching PDF");
          URL.revokeObjectURL(pdfUrl);
        }
      };
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">PDF Preview</h2>
          <button onClick={onClose} className="text-red-500">
            Close
          </button>
        </div>
        {pdfUrl && (
          <iframe src={pdfUrl} width="600" height="400" className="mt-4" />
        )}
      </div>
    </div>
  );
};

export default ModalViewDokumen;
