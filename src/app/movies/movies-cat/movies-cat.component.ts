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

  page!:Main;
  movies!:Content[];  
  @Input() title:string="";

  pageNumber:number = 1;
  totalItems:number = 0;
  sortField:string = "mediaId";
  order:boolean = false;

  constructor(private movieService:MovieService,
    private authService:AuthService){}

  setPage(pageNumber:number, sortField:string, order:boolean){
    let url:string = `?pageNumber=${pageNumber}&&sortField=${sortField}&&order=${order}`;
    this.pageNumber = pageNumber;
    if(this.title != undefined ) {
      url = `${url}&&title=${this.title}`
    }
    this.movieService.getMovies(url).subscribe({
      next: (data: any) => {
        this.page = data;
        this.totalItems = data.totalElements;
        this.movies = data.content;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Not found',
          text: 'Sorry this movie is not available yet',
        });
      }
    });
  }

  isAdmin():boolean{
    return this.authService.isAdmin();
  }

  isLogin():boolean{
    return this.authService.isLogin();
  }

  ngOnInit(): void {
    this.setPage(this.pageNumber,this.sortField,this.order);
  }

  setOrder(order:boolean):boolean{
    return this.order=order;
  }

  getPageNumbers(): number[] {
    const pageNumbers = [];
    for (let i = 1; i <= this.page?.totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  nextPage():number{
    return this.pageNumber+1;
  }

  previousPage():void{
    this.pageNumber-1;
  }

  deleteMovie(id:number){
    this.movieService.deleteMovie(id).subscribe({
      next: () => {
        this.movies = this.movies.filter(movie => movie.mediaId !== id);
      }
    })
  }

  search(title:string){
    this.title = title;
    this.setPage(this.pageNumber,this.sortField,this.order);
  }

}
