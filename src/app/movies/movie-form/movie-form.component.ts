import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MovieService } from '../services/movie.service';
import { Movie } from '../interfaces/movie';
import { CloudinaryModule } from '@cloudinary/ng';
import { UploadService } from '../../books/services/upload.service';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.css'
})
export class MovieFormComponent {
  
  //Obtenemos el id de la ruta si existe
  @Input()id = 0;

  //Creamos una imagen vacía
  imageUrl:string = '';

  constructor(private movieService:MovieService,
    private uploadService:UploadService,
    private fb:FormBuilder){}

  //Obtenemos el año actual
  actualYear = new Date().getFullYear();

  //Creamos una película vacía omitiendo el id
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

  //Cremos un formulario reactivo con los campos requeridos para crear una película
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

  //Obtenemos el error en el campo que le pasemos por parámetro
  invalidField(field: string){
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  ngOnInit(): void {
    if(this.id != 0 && this.id != undefined){
      this.movieService.getMovie(this.id).subscribe({
        next:(data)=>{
          this.movie = data;
          this.myForm.setValue({ //Asignamos los valores del formulario a los campos del libro que hemos buscado
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

  //Método para añadir una película
  addMovie(){
    if (this.myForm.valid) {
      this.uploadService.uploadFile(this.imageUrl).subscribe({
        next: (response:any) => {
          const imageUrl = response.secure_url; //Asignamos la url de la imagen a la imagen creada de tipo string
          this.imageUrl = imageUrl;
          const {...movie} = this.myForm.value; //Asignamos los campos del formulario a la película
          this.movie = movie;
          this.movie.imageUrl = imageUrl; 
          this.movieService.postMovie(this.movie).subscribe({
            next: (data) => {
              data.mediaId = this.id;
              Swal.fire({ //Mensaje de éxito en caso de que la pelicula se suba exitosamente
                title: "Good job!",
                text: "Movie added!",
                icon: "success",
              })
            },
            error: (err) => { //Mensaje de error a la hora de añadir un libro
              console.error('Error adding book:', err.message);
              Swal.fire({
                title: "Error",
                text: "There was an error adding the book. Please try again later.",
                icon: "error",
              });
            }
          });
          this.myForm.reset(); //Reseteamos el formulario
        },
        error: (err) => { //Mensaje de error a la hora de subir la imagen
          Swal.fire({
            title: "Opps...!",
            text: "Error!!" + err.message,
            icon: "error",
          });
        }
      });
    }
  }

  //Método para editar una película
  editMovie(){
    if (this.myForm.valid) {
      this.uploadService.uploadFile(this.imageUrl).subscribe({ //Subimos la imagen
        next: (response:any) => {
          const imageUrl = response.secure_url; //Asignamos la url en formato string
          this.imageUrl = imageUrl;
          const {...movie} = this.myForm.value; //Asignamos los valores a la pelicula
          this.movie = movie;
          this.movie.imageUrl = imageUrl; 
          this.movieService.putMovie(this.movie,this.id).subscribe({ //Editamos la pelicula
            next: (data) => {
              Swal.fire({ //Mensaje de éxito en caso de edición satisfactoria
                title: "Good job!",
                text: "Movie update succesfully!",
                icon: "success",
              })
            },
            error: (err) => { //Mensaje de error en caso de no poder editar correctamente
              Swal.fire({
                title: "Error",
                text: "There was an error updating the movie. Please try again later.",
                icon: "error",
              });
            }
          });
          this.myForm.reset(); //Reseteamos el formulario
        },
        error: (err) => { //Mensaje de error en caso de no poder subir la imagen
          Swal.fire({
            title: "Opps...!",
            text: "Error!!" + err.message,
            icon: "error",
          });
        }
      });
    }
  }

  //Método para asociar la imagen que creamos con el input de tipo file
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
