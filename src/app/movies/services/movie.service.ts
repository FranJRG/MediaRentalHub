import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Main, Movie, MovieAdd, MovieContent } from '../interfaces/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http:HttpClient) { }

  url:string = 'http://localhost:8080/movies';
  
  getMovies(url:string): Observable<Main> {
    return this.http.get<Main>(this.url+url);
  }

  getAllMovies():Observable<Main>{
    return this.http.get<Main>(this.url);
  }

  getMovie(id:number):Observable<Movie>{
    return this.http.get<Movie>(this.url+"/"+id);
  }

  getMovieAdd(id:number):Observable<MovieAdd>{
    return this.http.get<MovieAdd>(this.url+"/"+id);
  }

  deleteMovie(id:number):Observable<Movie>{
    return this.http.delete<Movie>(this.url+'/'+id);
  }

  postMovie(movie:Omit<MovieAdd,"mediaId">):Observable<MovieAdd>{
    return this.http.post<MovieAdd>(this.url + "/", movie);
  }

  putMovie(movie:MovieAdd,id:number):Observable<Movie>{
    return this.http.put<Movie>(`${this.url}/${id}`,movie);
  }
}
