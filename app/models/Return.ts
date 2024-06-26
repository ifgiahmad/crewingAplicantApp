class Return {
  id: bigint;
  message: string;
  isSuccess: boolean;

  constructor(
    id: bigint = BigInt(0),
    message: string = "",
    isSuccess: boolean = false
  ) {
    this.id = id;
    this.message = message;
    this.isSuccess = isSuccess;
  }
}

export default Return;
