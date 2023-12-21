export class User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  created_date: string;
  id_status: number;

  constructor(
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    created_date: string,
    id_status: number
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.username = username;
    this.created_date = created_date;
    this.id_status = id_status;
  }
}
