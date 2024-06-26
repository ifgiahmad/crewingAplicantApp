class User {
  Name: string;
  Email: string;
  Age: number;

  constructor(name: string = "", email: string = "", age: number = 0) {
    this.Name = name;
    this.Email = email;
    this.Age = age;
  }
}

export default User;
