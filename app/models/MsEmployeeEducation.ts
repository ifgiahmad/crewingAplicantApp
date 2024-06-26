class MsEmployeeEducations {
  id: number;
  employeeId?: number;
  rekrutmenId?: number;
  pendidikan?: string;
  jurusan?: string;
  namaInstitusi?: string;
  kota?: string;
  tglSelesai?: Date | null;
  createdBy?: string;
  createdTime?: Date | null;
  modifiedBy?: string;
  modifiedTime?: Date | null;
  aktif: boolean;
  mode?: string;
  menuForm?: string;

  constructor(
    Id: number = 0,
    Employee_Id: number = 0,
    RekrutmenId: number = 0,
    Pendidikan: string = "",
    Jurusan: string = "",
    NamaInstitusi: string = "",
    Kota: string = "",
    TglSelesai?: Date | null,
    CreatedBy: string = "",
    CreatedTime?: Date | null,
    ModifiedBy: string = "",
    ModifiedTime?: Date | null,
    Aktif: boolean = false,
    Mode: string = "",
    MenuForm: string = ""
  ) {
    this.id = Id;
    this.employeeId = Employee_Id;
    this.rekrutmenId = RekrutmenId;
    this.pendidikan = Pendidikan;
    this.jurusan = Jurusan;
    this.namaInstitusi = NamaInstitusi;
    this.kota = Kota;
    this.tglSelesai = TglSelesai ?? null;
    this.createdBy = CreatedBy;
    this.createdTime = CreatedTime ?? null;
    this.modifiedBy = ModifiedBy;
    this.modifiedTime = ModifiedTime ?? null;
    this.aktif = Aktif;
    this.mode = Mode;
    this.menuForm = MenuForm;
  }
}

export default MsEmployeeEducations;
