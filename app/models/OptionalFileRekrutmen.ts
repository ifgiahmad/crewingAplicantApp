class OptionalFileRekrutmens {
  id: number;
  rekrutmenId?: number;
  crewingId?: number;
  fileCategory?: string;
  fileName?: string;
  filePath?: string;
  fileLink?: string;
  documentDate?: Date | null;
  documentName?: string;
  documentValidDate?: Date | null;
  keterangan?: string;
  aktif?: boolean;
  createdBy?: string;
  createdDate?: Date | null;
  modifiedBy?: string;
  modifiedDate?: Date | null;
  mode?: string;
  fileDoc: File | null;

  constructor(
    Id: number = 0,
    CrewingId: number = 0,
    RekrutmenId: number = 0,
    FileCategory: string = "",
    FileName: string = "",
    DocumentName: string = "",
    DocumentDate?: Date | null,
    DocumentValidDate?: Date | null,
    Keterangan: string = "",
    FilePath: string = "",
    FileLink: string = "",
    Aktif: boolean = false,
    CreatedBy: string = "",
    CreatedDate?: Date | null,
    ModifiedBy: string = "",
    ModifiedDate?: Date | null,
    Mode: string = "",
    FileDoc: File | null = null
  ) {
    this.id = Id;
    this.crewingId = CrewingId;
    this.rekrutmenId = RekrutmenId;
    this.fileCategory = FileCategory;
    this.fileName = FileName;
    this.documentName = DocumentName;
    this.documentDate = DocumentDate ?? null;
    this.documentValidDate = DocumentValidDate ?? null;
    this.keterangan = Keterangan;
    this.filePath = FilePath;
    this.fileLink = FileLink;
    this.aktif = Aktif;
    this.createdBy = CreatedBy;
    this.createdDate = CreatedDate ?? null;
    this.modifiedBy = ModifiedBy;
    this.modifiedDate = ModifiedDate ?? null;
    this.mode = Mode;
    this.fileDoc = FileDoc;
  }
}

export default OptionalFileRekrutmens;
