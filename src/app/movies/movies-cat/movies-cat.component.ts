import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { Main, Content } from '../interfaces/movie';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { SearchBoxComponent } from '../search-box/search-box.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movies-cat',
  standalone: true,
  imports: [RouterLink,CommonModule,FormsModule,SearchBoxComponent],
  templateUrl: './movies-cat.component.html',
  styleUrl: './movies-cat.component.css'
})
export class MoviesCatComponent implements OnInit{
  
  //Creamos las variables necesarias para poder hacer el páginado
  page!:Main;
  movies!:Content[];  
  @Input() title:string="";

  pageNumber:number = 1;
  totalItems:number = 0;
  sortField:string = "mediaId";
  order:boolean = false;

  constructor(private movieService:MovieService,
    private authService:AuthService){}

  //Método para establecer la página en la que nos encontremos
  setPage(pageNumber:number, sortField:string, order:boolean){
    let url:string = `?pageNumber=${pageNumber}&&sortField=${sortField}&&order=${order}`;//Creamos la url básica para establecer la página
    this.pageNumber = pageNumber; //Le decimos que este pageNumber será igual al principal
    if(this.title != undefined ) { //Si el título existe (Buscamos algo en la barra de búsqueda)
      url = `${url}&&title=${this.title}`//Le añadimos el titulo a la url para filtrar
    }
    this.movieService.getMovies(url).subscribe({//Hacemos el getMovies de forma páginada
      next: (data: any) => {
        this.page = data;
        this.totalItems = data.totalElements;
        this.movies = data.content;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Not found',
          text: 'Sorry this movie is not available yet', //Si la pelicula no se encuentra mandamos un mensaje de error
        });
      }
    });
  }

  //Método que creamos para dar funciones según tu rol en la página
  isAdmin():boolean{
    return this.authService.isAdmin();
  }

  //Método que creamos para dar funciones según tu status en la página
  isLogin():boolean{
    return this.authService.isLogin();
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

  //Método para eliminar un libro
  deleteMovie(id:number){
    this.movieService.deleteMovie(id).subscribe({//Llamamos al método de delete del servicio
      next: () => {
        this.movies = this.movies.filter(movie => movie.media_id !== id); //Devolvemos la lista filtrada de peliculas eliminando la que coincida con el id
      }
    })
  }

  //Método para buscar por la barra de búsqueda
  search(title:string){
    this.title = title; //Asignamos el titulo al que recibe la funcion
    this.setPage(this.pageNumber,this.sortField,this.order); //Le pasamos el título a la función para filtrar buscar por título
  }

}
