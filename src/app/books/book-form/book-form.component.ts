import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../services/book.service';
import { Book } from '../interfaces/book';
import Swal from 'sweetalert2';
import { UploadService } from '../services/upload.service';
import { SearchBoxComponent } from '../search-box/search-box.component';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent implements OnInit{

  //Obtenemos el id de la ruta si existe
  @Input()id:number = 0;

  //Creamos una imagen vacía
  imageUrl : string = ''

  constructor(private bookService:BookService,
    private uploadService:UploadService,
    private fb:FormBuilder){}

  //Obtenemos el año actual
  actualYear = new Date().getFullYear();

  //Creamos un libro vacío omitiendo el id
  book:Omit<Book,"mediaId"> = {
    title:       '',
    releaseDate:  this.actualYear,
    gender:       '',
    imageUrl:     '',
    available:    true,
    stock:        0,
    rentals:      [],
    reviews:      [],
    author:       '',
    price:        0.0,
  }

  //Cremos un formulario reactivo con los campos requeridos para crear un libro
  myForm:FormGroup = this.fb.group({
    title:['',Validators.required],
    releaseDate:[this.actualYear],
    gender:['',Validators.required],
    imageUrl:[null],
    author:['',Validators.required],
    price:[null,Validators.required],
    available:[true],
    stock:[null,[Validators.required,Validators.minLength(1)]]
  })

  //Obtenemos el error en el campo que le pasemos por parámetro
  invalidField(field: string){
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  //Al cargar la página si el id es distinto de 0 o está definido
  ngOnInit(): void {
    if(this.id != 0 && this.id != undefined){ 
      this.bookService.getBook(this.id).subscribe({
        next:(data)=>{
          this.book = data;
          this.myForm.setValue({ //Asignamos los valores del formulario a los campos del libro que hemos buscado
            title:this.book.title,
            releaseDate:this.book.releaseDate,
            imageUrl:null,
            gender:this.book.gender,
            author:this.book.author,
            price: this.book.price === null ? 0 : this.book.price,
            available:this.book.available,
            stock:this.book.stock
          })
        }
      })
    }
  }

  //Método para editar un libro
  editBook(){
    if (this.myForm.valid) {
      this.uploadService.uploadFile(this.imageUrl).subscribe({ //Subimos la imagen a cloudinary
        next: (response:any) => {
          const imageUrl = response.secure_url; // Asignamos la imagen
          this.imageUrl = imageUrl; // La establecemos
          const {...book} = this.myForm.value; //Asignamos el libro
          this.book = book;
          this.book.imageUrl = imageUrl; 
          this.bookService.putBook(this.book,this.id).subscribe({ //Actualizamos el libro
            next: (data) => {
              Swal.fire({ //Mostramos mensaje de éxito si es válido
                title: "Good job!",
                text: "Movie update succesfully!",
                icon: "success",
                confirmButtonColor: '#428de661'
              })
              this.myForm.reset(); //Resetamos el formulario
            },
            error: (err) => { //Mostramos un mensaje de error en caso de tener algun error a la hora de editar el libro
              Swal.fire({
                title: "Error",
                text: "There was an error updating the movie. Please try again.",
                icon: "error",
                confirmButtonColor: '#428de661'
              });
            }
          });
        },
        error: (err) => { //Mostramos error si la imagen no se puede subir
          Swal.fire({
            title: "Opps...!",
            text: "Error uploading the image!!" + err.message,
            icon: "error",
            confirmButtonColor: '#428de661'
          });
        }
      });
    }
  }

  //Método para añadir un libro
  addBook() {
    if (this.myForm.valid) {
      this.uploadService.uploadFile(this.imageUrl).subscribe({ //Subiremos la imagen a cloudinary
        next: (response:any) => {
          const imageUrl = response.secure_url; //Asignamos la url de la imagen a la imagen en formato string
          this.imageUrl = imageUrl;
          const {...book} = this.myForm.value; // Asignamos el libro a los campos del formulario
          this.book = book;
          this.book.imageUrl = imageUrl; 
          this.bookService.postBook(this.book).subscribe({
            next: (data) => {
              Swal.fire({ // Mensaje de éxito a la hora de añadir el libro
                title: "Good job!",
                text: "Book added!",
                icon: "success",
                confirmButtonColor: '#428de661'
              })
            },
            error: (err) => {
              Swal.fire({ //Mensaje de error al añadir el libro
                title: "Error",
                text: "There was an error adding the book. Please try again later.",
                icon: "error",
                confirmButtonColor: '#428de661'
              });
            }
          });
          this.myForm.reset(); //Reseteamos el formulario
        },
        error: (err) => { // Mensaje de error al subir la imagen
          Swal.fire({
            title: "Opps...!",
            text: "Error!!" + err.message,
            icon: "error",
            confirmButtonColor: '#428de661'
          });
        }
      });
    }
  }

  //Método para asociar el input del html de la imagen a la imagen del objeto
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
