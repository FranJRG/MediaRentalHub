import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, Content, Main } from '../interfaces/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http:HttpClient) { }

  url = 'http://localhost:8080/books';
  
  getBooks(url:string): Observable<Main> {
    return this.http.get<Main>(this.url+url);
  }

  getAllBooks(): Observable<Main> {
    return this.http.get<Main>(this.url);
  }

  getBook(id:number):Observable<Book> {
    return this.http.get<Book>(`${this.url}/${id}`);
  }

  postBook(book:Omit<Book,"mediaId">):Observable<Book>{
    return this.http.post<Book>(this.url + "/", book);
  }

  putBook(book:Book,id:number):Observable<Book>{
    return this.http.put<Book>(`${this.url}/${id}`,book);
  }

  deleteBook(id:number):Observable<Book>{
    return this.http.delete<Book>(this.url+'/'+id);
  }
  
}
