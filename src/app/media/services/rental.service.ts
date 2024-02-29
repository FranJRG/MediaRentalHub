import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rental } from '../../user/interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  url:string = 'http://localhost:8080/rentals';

  constructor(private http:HttpClient) { }

  postRental(rental:Omit<Rental,"rentalId">):Observable<Rental>{
    return this.http.post<Rental>(`${this.url}/`,rental);
  }

  deleteRental(id:number):Observable<any>{
    return this.http.delete<any>(`${this.url}/${id}`);
  }

}
