import { Component, OnInit } from '@angular/core';
import { Book, Content } from '../books/interfaces/book';
import { BookService } from '../books/services/book.service';
import { MovieService } from '../movies/services/movie.service';
import { Movie, MovieContent } from '../movies/interfaces/movie';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  
  //Arrays para almacenar libros y películas
  books: Content[] = [];
  movies!:MovieContent[];

  constructor(private bookService:BookService,
    private movieService:MovieService){}

  //Cargamos todos los libros y películas para que el usuario pueda ver algunas de las que tenemos en nuestra App
  ngOnInit(): void {
      this.bookService.getAllBooks().subscribe({ //Obtenemos libros
        next: (data) => {
          this.books = data.content
        }
      })
      this.movieService.getAllMovies().subscribe({ //Obtenemos películas
        next: (data) => {
          this.movies = data.content
        }
      })
    }


}
