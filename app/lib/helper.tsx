import { useState } from "react";
import CrewRekrutmen from "../models/CrewRekrutmen";
import MsEmployeeCertificates from "../models/MsEmployeeCertificate";
import OptionalFileRekrutmens from "../models/OptionalFileRekrutmen";
import api from "./api";
import Return from "../models/Return";
import ReturnValues from "../models/ReturnValue";

export const constant = {
  API_MASTER_BY_TYPE_NON_AUTH: "api/onboard/masterbytype",
  API_GET_LIST_REKRUTMEN_NON_AUTH: "api/onboard/getCrewRekrutmenList",
  API_APPLICANT_SAVE_OPTIONAL_FILE_NON_AUTH: "api/onboard/saveOptionalFile",
  API_APPLICANT_SAVE_OPTIONAL_FILE_DOC_NON_AUTH:
    "api/onboard/saveOptionalFileDoc",
  API_APPLICANT_SAVE_APPLICANT_NON_AUTH: "api/onboard/saveApplicant",
  API_REKRUTMEN_SAVE_NON_AUTH: "api/onboard/saveRekrutmen",
  API_REKRUTMEN_GET_NON_AUTH: "api/onboard/getCrewRekrutmen",
  API_REKRUTMEN_LIST_EDUCATIONS_ID_NON_AUTH: "api/onboard/educations",
  API_REKRUTMEN_GET_EDUCATION_ID_NON_AUTH: "api/onboard/education",
  API_REKRUTMEN_SAVE_EDUCATION_NON_AUTH: "api/onboard/saveEducation",
  API_REKRUTMEN_SAVE_CERTIFICATE_NON_AUTH: "api/onboard/savecertificate",
  API_REKRUTMEN_SAVE_CERTIFICATE_DOC_NON_AUTH: "api/onboard/saveCertificateDoc",
  API_REKRUTMEN_LIST_CERTIFICATES_ID_NON_AUTH: "api/onboard/certificates",
  API_REKRUTMEN_GET_CERTIFICATE_ID_NON_AUTH: "api/onboard/certificatecrew",
  API_REKRUTMEN_SAVE_RIWAYAT_NON_AUTH: "api/onboard/saveRiwayat",
  API_REKRUTMEN_SAVE_RIWAYAT_DOC_NON_AUTH: "api/onboard/saveRiwayatDoc",
  API_REKRUTMEN_LIST_RIWAYAT_PEKERJAAN_ID_NON_AUTH:
    "api/onboard/riwayatPekerjaanList",
  API_REKRUTMEN_GET_RIWAYAT_PEKERJAAN_ID_NON_AUTH: "api/onboard/crewinglog",
  API_REKRUTMEN_SAVEPHOTO_NON_AUTH: "api/onboard/savephoto",
  API_REKRUTMEN_SAVE_OPTIONAL_FILE_NON_AUTH: "api/onboard/saveOptionalFile",
  API_REKRUTMEN_SAVE_OPTIONAL_FILE_DOC_NON_AUTH:
    "api/onboard/saveOptionalFileDoc",
  API_REKRUTMEN_GET_OPTIONAL_FILE_ID_NON_AUTH: "api/onboard/getOptionalFile",
  API_REKRUTMEN_LIST_OPTIONAL_FILE_ID_NON_AUTH:
    "api/onboard/getOptionalFileList",
  MASTER_TYPE_GENDER: "JENIS_KELAMIN",
  MASTER_TYPE_LVL: "LVL",
  MASTER_TYPE_CREW_LVL: "CREW_LVL",
  MASTER_TYPE_TAX_STATUS: "STATUS_PAJAK_CREW",
  MASTER_TYPE_BLOOD_TYPE: "GOL_DARAH",
  MASTER_TYPE_BANK: "BANK",
  MASTER_TYPE_RELIGION: "AGAMA",
  MASTER_TYPE_OPTIONAL_DOC: "CREW_OPTIONAL_DOC",
  MASTER_TYPE_TRAVEL_DOC: "CREW_TRAVEL_DOC",
  MASTER_TYPE_PENDIDIKAN: "CREW_PENDIDIKAN",
  MASTER_TYPE_CERTIFICATE_COMPETENCY_DOC: "CREW_CERTIFICATE_COMPETENCY",
  MASTER_TYPE_CERTIFICATE_PROFICIENCY_DOC: "CREW_CERTIFICATE_PROFICIENCY",
  MASTER_CURRENCY_NON_AUTH: "api/onboard/currency",
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Fungsi untuk memformat string tanggal ke format 'YYYY-MM-DD'
export const formatDateString = (dateString: string): string => {
  const substr = dateString.substring(0, 10);
  const date = new Date(substr);
  return date.toString();
};

export const formatDate = (dateString: string): string => {
  const substr = dateString.substring(0, 10);
  const date = new Date(substr);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  });
  return formatter.format(date);
};

export async function fetchLinkAsBlob(link: string): Promise<Blob> {
  const response = await fetch(link);
  if (!response.ok) {
    console.log(response);
    throw new Error("Network response was not ok");
  }
  const data = await response.blob();
  return data;
}

export async function createObjectURLFromLink(link: string): Promise<string> {
  const blob = await fetchLinkAsBlob(link);

  const objectURL = URL.createObjectURL(blob);
  return objectURL;
}

export async function GetDataRekrutmen(id: number): Promise<CrewRekrutmen> {
  console.log(id);
  const [rekrutmen, setCrewRekrutmen] = useState<CrewRekrutmen>(
    new CrewRekrutmen()
  );

  const getDataCrew = async () => {
    const response = await api.getDataIdNonAuth(
      id,
      constant.API_REKRUTMEN_GET_NON_AUTH
    );
    setCrewRekrutmen(response.data);
  };
  getDataCrew();
  console.log(rekrutmen);

  return rekrutmen;
}

export async function valCertificate(id: number): Promise<ReturnValues> {
  let countMCU = 0;
  let countAFF = 0;
  let countORU = 0;
  let countBST = 0;
  let countSCRB = 0;
  let listCertificates = [new MsEmployeeCertificates()];
  let listOptionalFiles = [new OptionalFileRekrutmens()];
  let rekrutmen = new CrewRekrutmen();
  let returnValue = new ReturnValues();

  if (id > 0) {
    const dataCrew = await api.getDataIdNonAuth(
      id,
      constant.API_REKRUTMEN_GET_NON_AUTH
    );
    rekrutmen = dataCrew.data;

    const listSertifikat = await api.getListDataById(
      id,
      constant.API_REKRUTMEN_LIST_CERTIFICATES_ID_NON_AUTH,
      "REKRUTMEN"
    );
    listCertificates = listSertifikat.data;

    const listOptionalFile = await api.getListDataFilePendukungId(
      id,
      constant.API_REKRUTMEN_LIST_OPTIONAL_FILE_ID_NON_AUTH,
      "REKRUTMEN"
    );
    listOptionalFiles = listOptionalFile.data;

    if (dataCrew.data.id > 0) {
      const today = new Date();
      if (listCertificates.length > 0) {
        countAFF = listCertificates.filter((x) =>
          x.certificateValidTo
            ? x.docType === "AFF - Advanced Fire Fighting" &&
              x.fileLink !== null &&
              x.fileName !== null &&
              x.filePath !== null &&
              new Date(x.certificateValidTo) >= today
            : x.docType === "zzzzzzzewq1235418"
        ).length;

        countBST = listCertificates.filter((x) =>
          x.certificateValidTo
            ? x.docType === "BST - Basic Safety Training" &&
              x.fileLink != null &&
              x.fileName != null &&
              x.filePath != null &&
              new Date(x.certificateValidTo) >= today
            : x.docType === "zzzzzzzewq1235418"
        ).length;

        countORU =
          rekrutmen.appliedPosition == "NAKHODA"
            ? listCertificates.filter((x) =>
                x.certificateValidTo
                  ? x.docType ===
                      "ORU - Sertifikat Keahlian Operator RADIO GMDSS" &&
                    new Date(x.certificateValidTo) >= today &&
                    x.fileLink != null &&
                    x.fileName != null &&
                    x.filePath != null
                  : x.docType === "zzzzzzzewq1235418"
              ).length
            : 1;

        countSCRB =
          rekrutmen.appliedPosition == "NAKHODA" ||
          rekrutmen.appliedPosition == "MUALIM I" ||
          rekrutmen.appliedPosition == "MUALIM III" ||
          rekrutmen.appliedPosition == "MUALIM II" ||
          rekrutmen.appliedPosition == "KKM"
            ? listCertificates.filter((x) =>
                x.certificateValidTo
                  ? x.docType ===
                      "SCRB - Proficiency in Survival Craft And Rescue Boats" &&
                    new Date(x.certificateValidTo) >= today &&
                    x.fileLink != null &&
                    x.fileName != null &&
                    x.filePath != null
                  : x.docType === "zzzzzzzewq1235418"
              ).length
            : 1;
      }
      if (listOptionalFile.data.length > 0) {
        countMCU = listOptionalFiles.filter((x) =>
          x.documentValidDate
            ? x.fileCategory === "MCU" &&
              new Date(x.documentValidDate) >= today &&
              x.fileLink != null &&
              x.filePath != null &&
              x.aktif === true
            : x.fileCategory === "zzzzzzzewq1235418"
        ).length;
      }

      if (
        countMCU === 0 &&
        countORU === 0 &&
        countAFF === 0 &&
        countBST === 0 &&
        countSCRB === 0
      ) {
        returnValue.isSuccess = false;
      } else {
        returnValue.isSuccess = true;
      }

      if (countMCU === 0) {
        returnValue.message =
          "<p>&#8226; Surat MCU harus diupload pada Tab File Pendukung Dan pastikan masih berlaku</p>";
      }
      if (countSCRB === 0) {
        returnValue.message +=
          "<p>&#8226; SCRB - Proficiency in Survival Craft And Rescue Boats harus diupload pada Tab Sertifikasi (Certificate Of Proficiency) Dan pastikan masih berlaku</p>";
      }
      if (countAFF === 0) {
        returnValue.message +=
          "<p>&#8226; Sertifikat AFF - Advanced Fire Fighting harus diupload pada Tab Sertifikasi (Certificate Of Proficiency) Dan pastikan masih berlaku</p>";
      }
      if (countBST === 0) {
        returnValue.message +=
          "<p>&#8226; SuratBST - Basic Safety Training harus diupload pada Tab Sertifikasi (Certificate Of Proficiency) Dan pastikan masih berlaku</p>";
      }
      if (countORU === 0) {
        returnValue.message +=
          "<p>&#8226; Surat ORU - Sertifikat Keahlian Operator RADIO GMDSS harus diupload pada Sertifikasi (Certificate Of Proficiency) Dan pastikan masih berlaku</p>";
      }
    }
  }

  return returnValue;
}

type AnyObject = { [key: string]: any };

// Fungsi rekursif untuk memformat properti tanggal dalam objek
export const formatDatesInObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(formatDatesInObject);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc: AnyObject, key: string) => {
      const value = obj[key];
      if (typeof value === "string" && isValidDate(value)) {
        acc[key] = formatDateString(value);
      } else if (typeof value === "object") {
        acc[key] = formatDatesInObject(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  }
  return obj;
};
