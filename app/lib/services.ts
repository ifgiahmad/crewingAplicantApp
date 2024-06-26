// services/CrewRekrutmenService.ts
import axios from "axios";
import CrewRekrutmen from "../models/CrewRekrutmen";
import Return from "../models/Return";
import getApiUrl from "./apiHelper";
import { constant } from "./helper";
import MsEmployeeEducations from "../models/MsEmployeeEducation";

const API_URL = getApiUrl() || "";
export const getAllCrewRekrutmen = async (): Promise<CrewRekrutmen[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getCrewRekrutmenById = async (
  id: number
): Promise<CrewRekrutmen> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const postCrewRekrutmen = async (
  CrewRekrutmen: CrewRekrutmen,
  endpoint: string
): Promise<CrewRekrutmen> => {
  console.log(CrewRekrutmen, endpoint);
  const response = await axios.post(`${API_URL}${endpoint}`, CrewRekrutmen);
  const tes = `${API_URL}${endpoint}`;
  console.log(tes);
  return response.data;
};

export const deleteCrewRekrutmen = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

/* export const getEducationById = async (
  id: number
): Promise<MsEmployeeEducations> => {
  const response = await axios.get(
    `${API_URL}${constant.API_REKRUTMEN_GET_EDUCATION_ID_NON_AUTH}/${id}`
  );
  const tes = `${API_URL}${constant.API_REKRUTMEN_GET_EDUCATION_ID_NON_AUTH}`;
  console.log(response);
  return response.data;
}; */

// Create
export const postEducation = async (
  data: Omit<MsEmployeeEducations, "id">
): Promise<MsEmployeeEducations> => {
  const response = await axios.post<MsEmployeeEducations>("/items", data);
  return response.data;
};

// Read
/* export const getEducationById = async (
  id: number
): Promise<MsEmployeeEducations> => {
  const tes = `${API_URL}${constant.API_REKRUTMEN_GET_EDUCATION_ID_NON_AUTH}/${id}`;
  console.log(tes);
  const response = await axios.get<MsEmployeeEducations>(
    `${API_URL}${constant.API_REKRUTMEN_GET_EDUCATION_ID_NON_AUTH}/${id}`
  );
  return new MsEmployeeEducations(response.data);
}; */

// Fetch Education by ID
export const getEducationById = async (
  id: number
): Promise<MsEmployeeEducations> => {
  const response = await axios.get<MsEmployeeEducations>(
    `${API_URL}${constant.API_REKRUTMEN_GET_EDUCATION_ID_NON_AUTH}/${id}`
  );
  const {
    id: eduId,
    aktif,
    createdBy,
    createdTime,
    employeeId,
    jurusan,
    kota,
    modifiedBy,
    modifiedTime,
    namaInstitusi,
    pendidikan,
    rekrutmenId,
    tglSelesai,
  } = response.data;
  return new MsEmployeeEducations(
    eduId,
    employeeId,
    rekrutmenId,
    pendidikan,
    jurusan,
    namaInstitusi,
    kota,
    tglSelesai,
    createdBy,
    createdTime,
    modifiedBy,
    modifiedTime,
    aktif
  );
};
