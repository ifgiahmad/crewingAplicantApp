class CrewRekrutmen {
  id: number;
  namaLengkap?: string;
  tempatLahir?: string;
  tanggalLahir?: Date | null;
  jenisKelamin?: string;
  agama?: string;
  nomorKTP?: string;
  tglBerlakuKTP?: Date | null;
  kotaDiKTP?: string;
  alamatDiKTP?: string;
  npwp?: string;
  bpjsKesehatan?: string;
  bpjstk?: string;
  namaBank?: string;
  noRekening?: string;
  namaPemilikRekening?: string;
  nomorKartuKeluarga?: string;
  silverCode?: string;
  appliedPosition?: string;
  pendidikan?: string;
  jurusan?: string;
  institusi?: string;
  tahun?: number;
  namaAyahKandung?: string;
  namaIbuKandung?: string;
  namaPasangan?: string;
  tglLahirPasangan?: Date | null;
  namaAnak1?: string;
  tglLahirAnak1?: Date | null;
  pendidikanAnak1?: string;
  namaAnak2?: string;
  tglLahirAnak2?: Date | null;
  pendidikanAnak2?: string;
  namaAnak3?: string;
  tglLahirAnak3?: Date | null;
  pendidikanAnak3?: string;
  namaKontakDarurat?: string;
  hubunganKontakDarurat?: string;
  noTelpKontakDarurat?: string;
  golonganDarah?: string;
  suku?: string;
  email?: string;
  noTelepon?: string;
  statusRekrutmen?: string;
  aktif: boolean;
  createdBy?: string;
  createdDate?: Date | null;
  modifiedBy?: string;
  modifiedDate?: Date | null;
  approvedBy?: string;
  approvedDate?: Date | null;
  fileName?: string;
  filePath?: string;
  fileLink?: string;
  crewingId?: number;
  fileNameKTP?: string;
  filePathKTP?: string;
  fileLinkKTP?: string;
  isCompletedData: boolean;
  willReplaceCrewId?: number;
  jenisKapalTerakhir?: string;
  jabatanTerakhir?: string;
  namaKontakDarurat2?: string;
  hubunganKontakDarurat2?: string;
  noTelpKontakDarurat2?: string;
  statusPajak?: string;
  domisili?: string;
  fotoKTP: File | null;
  fotoDiri: File | null;

  constructor(
    Id: number = 0,
    NamaLengkap: string = "",
    TempatLahir: string = "",
    TanggalLahir?: Date | null,
    JenisKelamin: string = "",
    Agama: string = "",
    NomorKTP: string = "",
    TglBerlakuKTP?: Date | null,
    KotaDiKTP: string = "",
    AlamatDiKTP: string = "",
    NPWP: string = "",
    BPJSKesehatan: string = "",
    BPJSTK: string = "",
    NamaBank: string = "",
    NoRekening: string = "",
    NamaPemilikRekening: string = "",
    NomorKartuKeluarga: string = "",
    SilverCode: string = "",
    AppliedPosition: string = "",
    Pendidikan: string = "",
    Jurusan: string = "",
    Institusi: string = "",
    Tahun: number = 0,
    NamaAyahKandung: string = "",
    NamaIbuKandung: string = "",
    NamaPasangan: string = "",
    TglLahirPasangan?: Date | null,
    NamaAnak1: string = "",
    TglLahirAnak1?: Date | null,
    PendidikanAnak1: string = "",
    NamaAnak2: string = "",
    TglLahirAnak2?: Date | null,
    PendidikanAnak2: string = "",
    NamaAnak3: string = "",
    TglLahirAnak3?: Date | null,
    PendidikanAnak3: string = "",
    NamaKontakDarurat: string = "",
    HubunganKontakDarurat: string = "",
    NoTelpKontakDarurat: string = "",
    GolonganDarah: string = "",
    Suku: string = "",
    Email: string = "",
    NoTelepon: string = "",
    StatusRekrutmen: string = "",
    Aktif: boolean = false,
    CreatedBy: string = "",
    CreatedDate?: Date | null,
    ModifiedBy: string = "",
    ModifiedDate?: Date | null,
    ApprovedBy: string = "",
    ApprovedDate?: Date | null,
    FileName: string = "",
    FilePath: string = "",
    FileLink: string = "",
    Crewing_id: number = 0,
    FileNameKTP: string = "",
    FilePathKTP: string = "",
    FileLinkKTP: string = "",
    isCompletedData: boolean = false,
    WillReplaceCrewId: number = 0,
    JenisKapalTerakhir: string = "",
    JabatanTerakhir: string = "",
    NamaKontakDarurat2: string = "",
    HubunganKontakDarurat2: string = "",
    NoTelpKontakDarurat2: string = "",
    StatusPajak: string = "",
    Domisili: string = "",
    FotoKTP: File | null = null,
    FotoDiri: File | null = null
  ) {
    this.id = Id;
    this.namaLengkap = NamaLengkap;
    this.tempatLahir = TempatLahir;
    this.tanggalLahir = TanggalLahir ?? null;
    this.jenisKelamin = JenisKelamin;
    this.agama = Agama;
    this.nomorKTP = NomorKTP;
    this.tglBerlakuKTP = TglBerlakuKTP ?? null;
    this.kotaDiKTP = KotaDiKTP;
    this.alamatDiKTP = AlamatDiKTP;
    this.npwp = NPWP;
    this.bpjsKesehatan = BPJSKesehatan;
    this.bpjstk = BPJSTK;
    this.namaBank = NamaBank;
    this.noRekening = NoRekening;
    this.namaPemilikRekening = NamaPemilikRekening;
    this.nomorKartuKeluarga = NomorKartuKeluarga;
    this.silverCode = SilverCode;
    this.appliedPosition = AppliedPosition;
    this.pendidikan = Pendidikan;
    this.jurusan = Jurusan;
    this.institusi = Institusi;
    this.tahun = Tahun;
    this.namaAyahKandung = NamaAyahKandung;
    this.namaIbuKandung = NamaIbuKandung;
    this.namaPasangan = NamaPasangan;
    this.tglLahirPasangan = TglLahirPasangan ?? null;
    this.namaAnak1 = NamaAnak1;
    this.tglLahirAnak1 = TglLahirAnak1 ?? null;
    this.pendidikanAnak1 = PendidikanAnak1;
    this.namaAnak2 = NamaAnak2;
    this.tglLahirAnak2 = TglLahirAnak2 ?? null;
    this.pendidikanAnak2 = PendidikanAnak2;
    this.namaAnak3 = NamaAnak3;
    this.tglLahirAnak3 = TglLahirAnak3 ?? null;
    this.pendidikanAnak3 = PendidikanAnak3;
    this.namaKontakDarurat = NamaKontakDarurat;
    this.hubunganKontakDarurat = HubunganKontakDarurat;
    this.noTelpKontakDarurat = NoTelpKontakDarurat;
    this.golonganDarah = GolonganDarah;
    this.suku = Suku;
    this.email = Email;
    this.noTelepon = NoTelepon;
    this.statusRekrutmen = StatusRekrutmen;
    this.aktif = Aktif;
    this.createdBy = CreatedBy;
    this.createdDate = CreatedDate ?? null;
    this.modifiedBy = ModifiedBy;
    this.modifiedDate = ModifiedDate ?? null;
    this.approvedBy = ApprovedBy;
    this.approvedDate = ApprovedDate ?? null;
    this.fileName = FileName;
    this.filePath = FilePath;
    this.fileLink = FileLink;
    this.crewingId = Crewing_id;
    this.fileNameKTP = FileNameKTP;
    this.filePathKTP = FilePathKTP;
    this.fileLinkKTP = FileLinkKTP;
    this.isCompletedData = isCompletedData;
    this.willReplaceCrewId = WillReplaceCrewId;
    this.jenisKapalTerakhir = JenisKapalTerakhir;
    this.jabatanTerakhir = JabatanTerakhir;
    this.namaKontakDarurat2 = NamaKontakDarurat2;
    this.hubunganKontakDarurat2 = HubunganKontakDarurat2;
    this.noTelpKontakDarurat2 = NoTelpKontakDarurat2;
    this.statusPajak = StatusPajak;
    this.domisili = Domisili;
    this.fotoDiri = FotoDiri;
    this.fotoKTP = FotoKTP;
  }
  /* isValid(): boolean {
    return (
      this.id > 0 &&
      typeof this.aktif === "boolean" &&
      this.fotoDiri !== null &&
      this.fotoKTP !== null &&
      this.fotoDiri.size <= 500 * 1024 &&
      this.fotoKTP.size <= 500 * 1024 // 500KB
    );
  } */
}

export default CrewRekrutmen;
