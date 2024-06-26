class KodeMaster {
  id: bigint;

  tipeMaster: string;

  kodeMaster: string;

  textMaster: string;

  urutan: number;

  createdBy: string;

  createdTime: Date;

  modifiedBy: string;

  modifiedTime: Date;

  aktif: boolean;

  constructor(
    id: bigint = BigInt(0),
    tipeMaster: string = "",
    kodeMaster: string = "",
    textMaster: string = "",
    urutan: number = 0,
    createdBy: string = "",
    createdTime: Date = new Date(),
    modifiedBy: string = "",
    modifiedTime: Date = new Date(),
    aktif: boolean = false
  ) {
    this.id = id;
    this.tipeMaster = tipeMaster;
    this.kodeMaster = kodeMaster;
    this.textMaster = textMaster;
    this.urutan = urutan;
    this.createdBy = createdBy;
    this.createdTime = createdTime;
    this.modifiedBy = modifiedBy;
    this.modifiedTime = modifiedTime;
    this.aktif = aktif;
  }
}

export default KodeMaster;
