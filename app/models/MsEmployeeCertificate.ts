class MsEmployeeCertificates {
  id: number;
  employeeId?: number;
  rekrutmenId?: number;
  certificateName?: string;
  certificateNo?: string;
  issuers?: string;
  certificateDate?: Date | null;
  certificateValidTo?: Date | null;
  createdBy?: string;
  createdTime?: Date | null;
  modifiedBy?: string;
  modifiedTime?: Date | null;
  aktif: boolean;
  fileName?: string;
  filePath?: string;
  fileLink?: string;
  docType?: string;
  docCategory?: string;
  keterangan?: string;
  mode?: string;
  fileDoc: File | null;

  constructor(
    Id: number = 0,
    EmployeeId: number = 0,
    RekrutmenId: number = 0,
    CertificateName: string = "",
    CertificateNo: string = "",
    Issuers: string = "",
    CertificateDate?: Date | null,
    CertificateValidTo?: Date | null,
    CreatedBy: string = "",
    CreatedTime?: Date | null,
    ModifiedBy: string = "",
    ModifiedTime?: Date | null,
    Aktif: boolean = false,
    FileName: string = "",
    FilePath: string = "",
    FileLink: string = "",
    DocType: string = "",
    DocCategory: string = "",
    Keterangan: string = "",
    Mode: string = "",
    FileDoc: File | null = null
  ) {
    this.id = Id;
    this.employeeId = EmployeeId;
    this.rekrutmenId = RekrutmenId;
    this.certificateName = CertificateName;
    this.certificateNo = CertificateNo;
    this.issuers = Issuers;
    this.certificateDate = CertificateDate ?? null;
    this.certificateValidTo = CertificateValidTo ?? null;
    this.createdBy = CreatedBy;
    this.createdTime = CreatedTime ?? null;
    this.modifiedBy = ModifiedBy;
    this.modifiedTime = ModifiedTime ?? null;
    this.aktif = Aktif;
    this.fileName = FileName;
    this.filePath = FilePath;
    this.fileLink = FileLink;
    this.docType = DocType;
    this.docCategory = DocCategory;
    this.keterangan = Keterangan;
    this.mode = Mode;
    this.fileDoc = FileDoc;
  }

  static fromJson(json: any): MsEmployeeCertificates {
    return new MsEmployeeCertificates(
      json.id,
      json.employeeId,
      json.RekrutmenId,
      json.CertificateName,
      json.CertificateNo,
      json.Issuers,
      json.CertificateDate,
      json.CertificateValidTo,
      json.CreatedBy,
      json.CreatedTime,
      json.ModifiedBy,
      json.ModifiedTime,
      json.Aktif,
      json.FileName,
      json.FIlePath,
      json.FileLink,
      json.DocType,
      json.DocCategory,
      json.Keterangan
    );
  }
}

export default MsEmployeeCertificates;
