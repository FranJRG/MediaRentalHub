import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MovieService } from '../services/movie.service';
import { Movie } from '../interfaces/movie';
import { CloudinaryModule } from '@cloudinary/ng';
import { ValidateTitleService } from '../services/validators/validate-title.service';
import { UploadService } from '../../books/services/upload.service';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.css'
})
export class MovieFormComponent {
  
  @Input()id = 0;

  imageUrl:string = '';

  constructor(private movieService:MovieService,
    private validateTitle:ValidateTitleService,
    private uploadService:UploadService,
    private fb:FormBuilder){}

  actualYear = new Date().getFullYear();

  movie:Omit<Movie,"mediaId"> = {
    title:       '',
    releaseDate:  this.actualYear,
    gender:       '',
    imageUrl:     '',
    available:    true,
    stock:        0,
    rentals:      [],
    reviews:      [],
    director:       '',
    price:        0.0,
  }

  myForm:FormGroup = this.fb.group({
    title:['',Validators.required],
    releaseDate:[this.actualYear],
    gender:['',Validators.required],
    imageUrl:[null],
    director:['',Validators.required],
    price:[null,Validators.required],
    available:[true],
    stock:[null,[Validators.required,Validators.minLength(1)]]
  })

  invalidField(field: string){
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  ngOnInit(): void {
    if(this.id != 0 && this.id != undefined){
      this.movieService.getMovie(this.id).subscribe({
        next:(data)=>{
          this.movie = data;
          this.myForm.setValue({
            title:this.movie.title,
            releaseDate:this.movie.releaseDate,
            imageUrl:null,
            gender:this.movie.gender,
            director:this.movie.director,
            price: this.movie.price === null ? 0 : this.movie.price,
            available:this.movie.available,
            stock:this.movie.stock
          })
        }
      })
    }
  }

  addMovie(){
    if (this.myForm.valid) {
      this.uploadService.uploadFile(this.imageUrl).subscribe({
        next: (response:any) => {
          const imageUrl = response.secure_url;
          this.imageUrl = imageUrl;
          const {...movie} = this.myForm.value;
          this.movie = movie;
          this.movie.imageUrl = imageUrl; 
          this.movieService.postMovie(this.movie).subscribe({
            next: (data) => {
              data.mediaId = this.id;
              Swal.fire({
                title: "Good job!",
                text: "Movie added!",
                icon: "success",
              })
            },
            error: (err) => {
              console.error('Error adding book:', err.message);
              Swal.fire({
                title: "Error",
                text: "There was an error adding the book. Please try again later.",
                icon: "error",
              });
            }
          });
          this.myForm.reset();
        },
        error: (err) => {
          Swal.fire({
            title: "Opps...!",
            text: "Error!!" + err.message,
            icon: "error",
          });
        }
      });
    }
  }

  editMovie(){
    if (this.myForm.valid) {
      this.uploadService.uploadFile(this.imageUrl).subscribe({
        next: (response:any) => {
          const imageUrl = response.secure_url;
          this.imageUrl = imageUrl;
          const {...movie} = this.myForm.value;
          this.movie = movie;
          this.movie.imageUrl = imageUrl; 
          this.movieService.putMovie(this.movie,this.id).subscribe({
            next: (data) => {
              Swal.fire({
                title: "Good job!",
                text: "Movie update succesfully!",
                icon: "success",
              })
            },
            error: (err) => {
              Swal.fire({
                title: "Error",
                text: "There was an error updating the movie. Please try again later.",
                icon: "error",
              });
            }
          });
          this.myForm.reset();
        },
        error: (err) => {
          Swal.fire({
            title: "Opps...!",
            text: "Error!!" + err.message,
            icon: "error",
          });
        }
      });
    }
  }

  getFile(event: Event) {
    
    const input: HTMLInputElement = <HTMLInputElement>event.target;
    
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        console.log('Got here: ', typeof(e.target.result));
        this.imageUrl = e.target.result;
      }
      reader.readAsDataURL(input.files[0]);
    }

  } 
}
