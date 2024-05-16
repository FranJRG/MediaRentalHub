import { Component, Input, OnInit } from '@angular/core';
import { Book, Review } from '../interfaces/book';
import { BookService } from '../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../shared/services/review.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/services/auth.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent implements OnInit{

  //Obtenemos el id de la ruta
  @Input()id!:number;

  book!:Book;
  date = new Date(); //Obtenemos la fecha actual

  //Creamos una review vacía
  review:Omit<Review, "reviewId"> = {
    userId:   this.authService.getUserId(),
    mediaId:  this.id,
    comment:  "",
    rating:   0,
    creation_date: this.date
  }

  constructor(private bookService:BookService,
    private router:Router,
    private reviewService:ReviewService,
    private authService:AuthService){}

  //Variable para mostrar y ocultar la sección de añadir comentarios
  show:boolean = false;

  //Verificamos que el usuario este logueado
  isLogin():boolean{
    return this.authService.isLogin();
  }
  
  //Obtenemos el id del usuario
  getUserId():number{
    return this.authService.getUserId();
  }
  
  //Al cargar la página mostramos los datos del libro concreto
  ngOnInit(): void {
    this.review.mediaId = this.id;
    this.bookService.getBook(this.id).subscribe(
      (data) => {
        this.book = data;
      }
    );
  }
  
  //Método para mostrar la sección de añadir un comentario
  showAddComment() {
    const swalContent = `
      <div *ngIf="isLogin()" class="mt-3">
        <div *ngIf="show" class="review-form">
          <div class="form-group">
            <label for="rating">Rating:</label>
            <input
              id="rating"
              type="number"
              min="0"
              max="5"
              class="form-control"
              name="rating"
              #ratingInput
            />
          </div>
          <div class="form-group">
            <label for="comment">Comment:</label>
            <textarea
              id="comment"
              class="form-control"
              rows="3"
              name="comment"
              #commentInput
            ></textarea>
          </div>
          <br>
          <button id="addComment" class="btn btn-success">Add Review</button>
        </div>
      </div>
    `;
  
    Swal.fire({ //Con Swal mostramos la sección
      html: swalContent,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'sweet-alert-popup',
        closeButton: 'sweet-alert-close-button'
      },
      didOpen: () => { //Debido a que Swal no entiende las directivas de angular deberemos rescatar los elementos y añadirlos
        const addButton = document.getElementById('addComment');
        addButton?.addEventListener('click', () => {
          const rating = (document.getElementById('rating') as HTMLInputElement).value;
          const comment = (document.getElementById('comment') as HTMLTextAreaElement).value;
          this.addReview(comment, parseInt(rating)); //Llamamos al método de addReview para añadir la valoracion
        });
      }
    });
  }
  
  
  //Esta función será para mostrar con SweetAlert la sección de comentarios de una película o libro
  showComments() {
    let commentsHtml = '';
    
    // Verificar si hay comentarios
    if (this.book.reviews == null || this.book.reviews.length === 0) {
      commentsHtml = '<h3>No comments yet!</h3>';
    } else {
      // Iterar sobre los comentarios
      for (const review of this.book.reviews) { //Recorremos la lista de comentarios 
          //Estructura del html que mostramos
          commentsHtml += `
            <div class="list-group-item">
              <h4 class="list-group-item-heading">
                User ID: ${review.userId}
              </h4>
              <p class="list-group-item-text">${review.comment}</p>
              <p class="list-group-item-text">Rating: ${review.rating}</p>
              ${(review.userId === this.getUserId()) ? `
                <button class="btn btn-outline-danger" id="deleteReviewButton_${review.reviewId}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                  </svg>
                </button>
              ` : ''}
              <hr>
            </div>
          `;
      }
    }
    Swal.fire({ //Con Swal le asignamos funcionalidad al boton
      title: 'Comments <hr>',
      html: commentsHtml,
      confirmButtonText: 'Close',
      confirmButtonColor: '#428de661',
      didOpen: () => {
        for (const review of this.book.reviews) {
          if (review.userId === this.getUserId()) {
            const deleteButton = document.getElementById(`deleteReviewButton_${review.reviewId}`); //Obtenemos el botón con getElementById
            if (deleteButton) { //Si existe le damos la función de eliminar
              deleteButton.addEventListener('click', () => {
                this.deleteReview(review.reviewId); 
              });
            }
          }
        }
      }
    });
  }
  
  //Método para añadir un comentario
  addReview(comment:string, rating:number) {
    this.review.comment = comment;
    this.review.rating = rating;
    this.reviewService.postReview(this.review).subscribe({
      next: (data) => {
        console.log(comment, rating);
        this.review.mediaId = this.id; //Le asignamos el id
        this.review = data; 
        this.book.reviews.push(data); //Añadimos el comentario al array de comentarios que pertenece a libros
        Swal.fire({ //Mostramos un mensaje de éxito
          title: "Good job!",
          text: "Review added succesfully!",
          icon: "success",
          confirmButtonColor: '#428de661',
        })
        this.show=false; //Ocultamos el formulario
      },
      error:(err) => { //Si existe algún error mostramos el mensaje
        Swal.fire({
          title: "Oops..!",
          text: "Something go bad!",
          icon: "error",
          confirmButtonColor: '#428de661',
        })
      },
    })
  }

  //Cancelamos el añadir un comentario
  close(){
    this.show = false;
  }

  //Método para eleminar un comentario
  deleteReview(id:number){
    this.reviewService.deleteReview(id).subscribe({
      next : () => {
        this.book.reviews.filter((review) => review.reviewId != id) //Filtramos los comentario para quitarlos de la lista
        Swal.fire({ // Mostramos un mensaje de éxito en caso de ser eliminado satisfactoriamente
          icon:'success',
          title:'Delete comment',
          text:'Deleted correctly',
          confirmButtonColor: '#428de661',
        })
      },
      error : (err) => { //Si hay algún error mostramos el mensaje de error
        Swal.fire({
          icon:'error',
          title:'Delete comment',
          text:'Error! Something went bad',
          confirmButtonColor: '#428de661'
        }) 
      }
    })
  }

  //Método para volver al catálogo
  goTo(){
    this.router.navigateByUrl('/books/catalogue');
  }
  
  //Método para mostrar el poder agregar un comentario
  showArea(){
    this.show = true;
  }
}
