class ReturnValues {
  id: number;
  message?: string;
  isSuccess: boolean;

  constructor(
    Id: number = 0,
    Message: string = "",
    IsSuccess: boolean = false
  ) {
    this.id = Id;
    this.isSuccess = IsSuccess;
    this.message = Message;
  }
}

export default ReturnValues;
