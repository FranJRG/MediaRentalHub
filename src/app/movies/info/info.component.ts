import { Component, Input, OnInit } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { Movie, Review } from '../interfaces/movie';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ReviewService } from '../../shared/services/review.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css',
})
export class InfoComponent implements OnInit {
  @Input()id: number = 0;

  @Input() movie!: Movie;
  date = new Date();
  
  review: Omit<Review, 'reviewId'> = {
    userId: this.authService.getUserId(),
    mediaId: this.id,
    comment: '',
    rating: 0,
    creation_date: this.date,
    deleted: false
  };

  show: boolean = false;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private reviewService: ReviewService,
    private authService:AuthService){}

  isLogin():boolean{
    return this.authService.isLogin();
  }

  getUserId():number{
    return this.authService.getUserId();
  }

  ngOnInit(): void {
    this.review.mediaId = this.id;
    this.movieService.getMovie(this.id).subscribe((data) => {
      this.movie = data;
    });
  }

  showComments() {
    let commentsHtml = '';
    
    // Verificar si hay comentarios
    if (this.movie.reviews == null || this.movie.reviews.length === 0) {
      commentsHtml = '<h3>No comments yet!</h3>';
    } else {
      // Iterar sobre los comentarios
      for (const review of this.movie.reviews) {
        if (review.deleted === false) {
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
            </div>
          `;
        }
      }
    }
    Swal.fire({
      title: 'Comments',
      html: commentsHtml,
      confirmButtonText: 'Close',
      didOpen: () => {
        for (const review of this.movie.reviews) {
          if (review.deleted === false && review.userId === this.getUserId()) {
            const deleteButton = document.getElementById(`deleteReviewButton_${review.reviewId}`);
            if (deleteButton) {
              deleteButton.addEventListener('click', () => {
                this.deleteReview(review.reviewId);
              });
            }
          }
        }
      }
    });
  }
  

  addReview() {
    this.reviewService.postReview(this.review).subscribe({
      next: (data) => {
        this.review.mediaId = data.mediaId
        this.review = data;
        this.movie.reviews.push(data);
        Swal.fire({
          title: "Good job!",
          text: "Review added succesfully!",
          icon: "success",
        })
        this.show = false;
      },
      error: (err) => {
        Swal.fire({
          title: "Oops..!",
          text: "Something go bad!",
          icon: "error",
        })
      }
    });
  }

  deleteReview(id:number){
    this.reviewService.deleteReview(id).subscribe({
      next : () => {
        this.movie.reviews.filter((review) => review.reviewId != id)
        Swal.fire({
          icon:'success',
          title:'Delete comment',
          text:'Deleted correctly' 
        })
      },
      error : (err) => {
        Swal.fire({
          icon:'error',
          title:'Delete comment',
          text:'Error! Something went bad' 
        }) 
      }
    })
  }

  goTo() {
    this.router.navigateByUrl('/movies/catalogue');
  }

  showArea() {
    this.show = true;
  }
}
