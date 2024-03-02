import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../../books/interfaces/book';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http:HttpClient) { }

  //Url standar 
  private url = 'https://proyectoapi-franjrg.onrender.com/reviews/';

  //Añadir una review
  postReview(review:Omit<Review, "reviewId">):Observable<Review>{
    return  this.http.post<Review>(this.url, review);
  }

  //Eliminar una review
  deleteReview(id:number):Observable<any>{
    return this.http.delete<any>(`${this.url}${id}`);
  }
}
