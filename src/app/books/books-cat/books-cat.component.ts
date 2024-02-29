import { Component, Input, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { Book, Content, Main } from '../interfaces/book';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { SearchBoxComponent } from '../search-box/search-box.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-books-cat',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,SearchBoxComponent],
  templateUrl: './books-cat.component.html',
  styleUrl: './books-cat.component.css'
})
export class BooksCatComponent implements OnInit{

  //Creamos las variables necesarias para poder hacer el páginado
  page!:Main
  books!:Content[]; 

  pageNumber:number = 1;
  totalItems:number = 0;
  sortField:string = "mediaId";
  order:boolean = false;
  @Input() title:string=""; //Para la barra de búsqueda


  constructor(private bookService:BookService,
    private authService:AuthService){}

  //Método que creamos para dar funciones según tu status en la página
  isLogin():boolean{
    return this.authService.isLogin(); //Devolvemos si el usuario esta logueado o no
  }

  //Para saber si el usuario es admin
  isAdmin():boolean{
    return this.authService.isAdmin(); //Devolvemos si el usuario es admin
  }

  //Método para establecer la página en la que nos encontremos
  setPage(pageNumber:number, sortField:string, order:boolean){
    let url:string = `?pageNumber=${pageNumber}&&sortField=${sortField}&&order=${order}`; //Creamos la url básica para establecer la página
    this.pageNumber = pageNumber; //Le decimos que este pageNumber será igual al principal
    this.order=order; //Lo mismo con el orden
    if(this.title != undefined ) { //Si el título existe (Buscamos algo en la barra de búsqueda)
      url = `${url}&&title=${this.title}` //Le añadimos el titulo a la url para filtrar
    }
    this.bookService.getBooks(url).subscribe({ //Hacemos el getBooks de forma página 
      next: (data: any) => {
        this.page = data;
        this.totalItems = data.totalElements;
        this.books = data.content;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Not found',
          text: 'Sorry this book is not available yet', //Si el libro no se encuentra mandamos un mensaje de error
        });
      }
    });
  }

  //Cargamos la función setPage para ver los libros
  ngOnInit(): void {
    this.setPage(this.pageNumber,this.sortField,this.order);
  }

  //Establecemos el orden por que queremos ver los libros
  setOrder(order:boolean):boolean{
    return this.order=order;
  }

  //Obtenemos el número de páginas
  getPageNumbers(): number[] {
    const pageNumbers = []; //Array para almacenar el número de paginas
    for (let i = 1; i <= this.page?.totalPages; i++) {
      pageNumbers.push(i); //Añadimos las páginas al array  de páginas 
    }
    return pageNumbers;
  }

  //Método para pasar de página
  nextPage():number{
    return this.pageNumber+1; //Devolvemos la página + 1
  }
 
  //Método para ir para atrás
  previousPage():void{
    this.pageNumber-1; // Devolvemos la página -1
  }

  //Método para eliminar un libro
  deleteBook(id:number){
    this.bookService.deleteBook(id).subscribe({ //Llamamos al método de delete del servicio
      next: () => {
        this.books = this.books.filter(book => book.mediaId !== id); //Devolvemos la lista filtrada de libros eliminando el que coincida con el id
      }
    })
  }

  //Método para buscar por la barra de búsqueda
  search(title:string){
    this.title = title; //Asignamos el titulo al que recibe la funcion
    this.setPage(this.pageNumber,this.sortField,this.order); //Le pasamos el título a la función para filtrar buscar por título
  }

}
