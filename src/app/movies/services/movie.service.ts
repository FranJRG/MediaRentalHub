import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Main, Movie, MovieContent } from '../interfaces/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http:HttpClient) { }

  url:string = 'https://proyectoapi-franjrg.onrender.com/movies';
  
  getMovies(url:string): Observable<Main> {
    return this.http.get<Main>(this.url+url);
  }

  getAllMovies():Observable<Main>{
    return this.http.get<Main>(this.url);
  }

  getMovie(id:number):Observable<Movie>{
    return this.http.get<Movie>(this.url+"/"+id);
  }

  deleteMovie(id:number):Observable<Movie>{
    return this.http.delete<Movie>(this.url+'/'+id);
  }

  postMovie(movie:Omit<Movie,"mediaId">):Observable<Movie>{
    return this.http.post<Movie>(this.url + "/", movie);
  }

  putMovie(movie:Movie,id:number):Observable<Movie>{
    return this.http.put<Movie>(`${this.url}/${id}`,movie);
  }
}
