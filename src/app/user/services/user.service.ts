import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  url:string = "http://localhost:8080/users";
  
  getUsers():Observable<User[]>{
    return  this.http.get<User[]>(this.url);
  }

  getUser(id:number):Observable<User>{
    return this.http.get<User>(`${this.url}/${id}`);
  }

  postUser(user:Omit<User,"user_id">):Observable<User>{
    return this.http.post<User>(this.url + "/", user);
  }

  putUser(user:Omit<User, 'user_id' | "registration_date" | "password" | "rentals" | "reviews" | "activated">,id:number):Observable<User>{
    return this.http.put<User>(`${this.url}/${id}`,user);
  }

  deleteUser(id?:number):Observable<any>{
    return this.http.delete<any>(`${this.url}/${id}`);
  }

}
