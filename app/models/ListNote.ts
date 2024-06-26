class ListNotes {
  note?: string;
  position?: string;
  type?: string;
  all: boolean;

  constructor(
    Note: string = "",
    Position: string = "",
    Type: string = "",
    All: boolean = false
  ) {
    this.position = Position;
    this.note = Note;
    this.type = Type;
    this.all = All;
  }
}

export default ListNotes;
