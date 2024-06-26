import getApiUrl from "./apiHelper";
import { constant } from "./helper";
import axios from "axios";
import CrewRekrutmen from "../models/CrewRekrutmen";
import Currency from "../models/Currencies";

const apiUrl = getApiUrl();
const api = {
  getCrewRekrutmenListNonAuth: async (
    Param1, //Status Crew
    Param2, // Kode Pelaut
    Param3, // Nama Pelaut
    Param4, //Tanggal LAhir
    Param5 //NIK
  ) => {
    try {
      //"https://localhost:7299/api/onboard/getCrewRekrutmenList?Param1=ONBOARD&Param2=1234567890&Param3=robert&Param4=2024-05-01&Param5=322131124213234";
      const response = await fetch(
        `${apiUrl}${constant.API_GET_LIST_REKRUTMEN_NON_AUTH}?Param1=${Param1}&Param2=${Param2}&Param3=${Param3}&Param4=${Param4}&Param5=${Param5}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (e) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  getMasterByTypeNonAuth: async (type) => {
    try {
      const response = await fetch(
        `${apiUrl}${constant.API_MASTER_BY_TYPE_NON_AUTH}?type=${type}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (e) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  getMasterCurrencyNonAuth: async () => {
    try {
      const response = await fetch(
        `${apiUrl}${constant.MASTER_CURRENCY_NON_AUTH}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const uniqueKeys = new Set();

      return data.filter((item) => {
        const keyValue = item["currency"];
        if (uniqueKeys.has(keyValue)) {
          return false;
        } else {
          uniqueKeys.add(keyValue);
          return true;
        }
      });
    } catch (e) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  getListDataEducationId: async (id, type) => {
    try {
      const response = await axios.get(
        `${apiUrl}${constant.API_REKRUTMEN_LIST_EDUCATIONS_ID_NON_AUTH}?empId=${id}&menuForm=${type}`
      );
      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },

  getDataEducationId: async (id) => {
    try {
      const response = await axios.get(
        `${apiUrl}${constant.API_REKRUTMEN_GET_EDUCATION_ID_NON_AUTH}?Id=${id}`
      );
      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.data;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },

  getListDataRiwayatPekerjaanId: async (id) => {
    try {
      const response = await axios.get(
        `${apiUrl}${constant.API_REKRUTMEN_LIST_RIWAYAT_PEKERJAAN_ID_NON_AUTH}?rekId=${id}`
      );
      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },

  getListDataFilePendukungId: async (id, endpoint, menu) => {
    try {
      const response = await axios.get(
        `${apiUrl}${endpoint}?Id=${id}&Menu=${menu}`
      );
      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },

  getDataIdNonAuth: async (id, endpoint) => {
    try {
      const response = await axios.get(`${apiUrl}${endpoint}?Id=${id}`);

      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },

  //Menampilkan list data berdasarkan Id Crew/Pelamar
  getListDataById: async (id, endpoint, type) => {
    try {
      const response = await axios.get(
        `${apiUrl}${endpoint}?empId=${id}&menuForm=${type}`
      );
      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },

  //Menampilkan data berdasarkan Id
  getDataByIdNonAuth: async (id, endpoint) => {
    try {
      const response = await axios.get(`${apiUrl}${endpoint}?Id=${id}`);
      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.data;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },

  //Posting Data
  postNonAuth: async (body, endpoint) => {
    console.log(body, endpoint);
    try {
      const response = await axios.post(`${apiUrl}${endpoint}`, body);
      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },

  //Posting Dokumen Data
  postDocNonAuth: async (body, endpoint) => {
    try {
      const response = await axios.post(`${apiUrl}${endpoint}`, body);
      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },

  postFotoNonAuth: async (body, endpoint) => {
    try {
      const response = await axios.post(`${apiUrl}${endpoint}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // const response = await axios.post(`${apiUrl}${endpoint}`, body);
      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },

  //Posting Applicant
  postApplicant: async (body, endpoint) => {
    console.log(body, endpoint);
    try {
      const response = await axios.post(`${apiUrl}${endpoint}`, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },

  /* postOptionalFileNonAuth: async (body) => {
    try {
      const response = await fetch(
        `${apiUrl}${constant.API_REKRUTMEN_SAVE_OPTIONAL_FILE_NON_AUTH}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },
  fetchData: async (endpoint) => {
    try {
      const response = await fetch(`${apiUrl}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  postData: async (endpoint, body) => {
    try {
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  }, */
  // Tambahkan metode lainnya sesuai kebutuhan
};

export default api;
