import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { Content, Main } from '../interfaces/book';
import { BookService } from '../services/book.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchBoxComponent } from '../search-box/search-box.component';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchBoxComponent],
  templateUrl: './manage-books.component.html',
  styleUrl: './manage-books.component.css'
})
export class ManageBooksComponent {

  page!:Main;
  books!:Content[];
  @Input() title:string="";

  pageNumber:number = 1;
  totalItems:number = 0;
  sortField:string = "mediaId";
  order:boolean = false;
  
  constructor(private bookService:BookService){}
  
  setPage(pageNumber:number, sortField:string, order:boolean){
    let url:string = `?pageNumber=${pageNumber}&&sortField=${sortField}&&order=${order}`;//Creamos la url básica para establecer la página
    this.pageNumber = pageNumber; //Le decimos que este pageNumber será igual al principal
    if(this.title != undefined ) { //Si el título existe (Buscamos algo en la barra de búsqueda)
      url = `${url}&&title=${this.title}`//Le añadimos el titulo a la url para filtrar
    }
    this.bookService.getBooks(url).subscribe({//Hacemos el getBooks de forma páginada
      next: (data: any) => {
        this.page = data;
        this.totalItems = data.totalElements;
        this.books = data.content;
      },
      error: (err) => {
        if(err.status != 401){
        Swal.fire({
          icon: 'error',
          title: 'Not found',
          text: 'Sorry this movie is not available yet', //Si el libro no se encuentra mandamos un mensaje de error
        });
      }
      }
    });
  }

  ngOnInit(): void {
    this.setPage(this.pageNumber,this.sortField,this.order);
  }

  setOrder(order:boolean):boolean{
    return this.order=order;
  }

  //Obtenemos el número de páginas
  getPageNumbers(): number[] {
    const pageNumbers = [];
    for (let i = 1; i <= this.page?.totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  //Método para pasar de página
  nextPage():number{
    return this.pageNumber+1;
  }

  //Método para vovler una página
  previousPage():void{
    this.pageNumber-1;
  }

  //Método para buscar por la barra de búsqueda
  search(title:string){
    this.title = title; //Asignamos el titulo al que recibe la funcion
    this.setPage(this.pageNumber,this.sortField,this.order); //Le pasamos el título a la función para filtrar buscar por título
  }

  deleteBook(id:number){
    this.bookService.deleteBook(id).subscribe({
      next : () => {
        this.books.filter(book => id !== book.media_id)
        Swal.fire({
          icon:'success',
          title:'Deleted',
          text:'Book delete success'
        })
      },
      error : (err) => {
        Swal.fire({
          title:'Error',
          text:'Error' + err.message,
          icon:'error'
        })
      } 
    })
  }

}
