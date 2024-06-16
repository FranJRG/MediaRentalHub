import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, BookAdd, Content, Main } from '../interfaces/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http:HttpClient) { }

  //Url para tirar peticiones
  url = 'https://proyectoapi-franjrg.onrender.com/books';
  
  //Obtener todos los libros de forma páginada
  getBooks(url:string): Observable<Main> {
    return this.http.get<Main>(this.url+url);
  }

  //Obtener todos los libros
  getAllBooks(): Observable<Main> {
    return this.http.get<Main>(this.url);
  }

  //Obtenemos un libro por su id
  getBook(id:number):Observable<Book> {
    return this.http.get<Book>(`${this.url}/${id}`);
  }

  getBookAdd(id:number):Observable<BookAdd> {
    return this.http.get<BookAdd>(`${this.url}/${id}`);
  }

  //Agregamos un libro
  postBook(book:Omit<BookAdd,"mediaId">):Observable<Book>{
    return this.http.post<Book>(this.url + "/", book);
  }
  
  //Editamos un libro
  putBook(book:BookAdd,id:number):Observable<Book>{
    return this.http.put<Book>(`${this.url}/${id}`,book);
  }

  //Eliminamos un libro
  deleteBook(id:number):Observable<Book>{
    return this.http.delete<Book>(this.url+'/'+id);
  }
  
}