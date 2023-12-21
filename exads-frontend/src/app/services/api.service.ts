import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => response.data.users)
    );
  }

  createUser(user: User): Observable<any> {
    delete user.id
    delete user.created_date
    return this.http.post<any>(this.apiUrl, {user: user});
  }

  checkUsernameAvailability(username: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + "?username=" + username);
  }

  updateUser(user: User): Observable<any> {
    const url = `${this.apiUrl}/${user.id}`;
    delete user.username
    delete user.created_date
    delete user.id
    return this.http.patch<any>(url, {user: user});
  }

  deleteUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.delete<any>(url);
  }
}
