class CrewingLogs {
  id: number;
  employeeId?: number;
  perusahaan?: string;
  tanggal?: Date | null;
  tanggalSelesai?: Date | null;
  status?: string;
  kapal?: string;
  gtKapal?: string;
  jabatan?: string;
  alasanOff?: string;
  keterangan?: string;
  currency?: string;
  gajiTerakhir?: number;
  createdBy?: string;
  createdTime?: Date | null;
  modifiedBy?: string;
  modifiedTime?: Date | null;
  rekrutmenId?: number;
  fileName?: string;
  filePath?: string;
  fileLink?: string;
  mode?: string;
  menuForm?: string;
  fileDoc: File | null;

  constructor(
    Id: number = 0,
    EmployeeId: number = 0,
    Perusahaan: string = "",
    Tanggal?: Date | null,
    TanggalSelesai?: Date | null,
    Status: string = "",
    Kapal: string = "",
    GTKapal: string = "",
    Jabatan: string = "",
    AlasanOff: string = "",
    Keterangan: string = "",
    Currency: string = "",
    GajiTerakhir: number = 0,
    CreatedBy: string = "",
    CreatedTime?: Date | null,
    ModifiedBy: string = "",
    ModifiedTime?: Date | null,
    RekrutmenId: number = 0,
    FileName: string = "",
    FilePath: string = "",
    FileLink: string = "",
    Mode: string = "",
    FileDoc: File | null = null
  ) {
    this.id = Id;
    this.employeeId = EmployeeId;
    this.perusahaan = Perusahaan;
    this.tanggal = Tanggal ?? null;
    this.tanggalSelesai = TanggalSelesai ?? null;
    this.status = Status;
    this.kapal = Kapal;
    this.gtKapal = GTKapal;
    this.jabatan = Jabatan;
    this.alasanOff = AlasanOff;
    this.keterangan = Keterangan;
    this.currency = Currency;
    this.gajiTerakhir = GajiTerakhir;
    this.createdBy = CreatedBy;
    this.createdTime = CreatedTime ?? null;
    this.modifiedBy = ModifiedBy;
    this.modifiedTime = ModifiedTime ?? null;
    this.rekrutmenId = RekrutmenId;
    this.fileName = FileName;
    this.filePath = FilePath;
    this.fileLink = FileLink;
    this.mode = Mode;
    this.fileDoc = FileDoc;
  }
}

export default CrewingLogs;
