import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rental } from '../../user/interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  url:string = 'https://proyectoapi-franjrg.onrender.com/rentals';

  constructor(private http:HttpClient) { }

  //Añadimos una rental
  postRental(rental:Omit<Rental,"rentalId">):Observable<Rental>{
    return this.http.post<Rental>(`${this.url}/`,rental);
  }

  //Eliminamos una renta
  deleteRental(id:number):Observable<any>{
    return this.http.delete<any>(`${this.url}/${id}`);
  }

}
