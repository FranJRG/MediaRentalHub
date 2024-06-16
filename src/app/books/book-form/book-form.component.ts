import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../services/book.service';
import { Book, BookAdd } from '../interfaces/book';
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
  image_url : string = ''

  constructor(private bookService:BookService,
    private uploadService:UploadService,
    private fb:FormBuilder){}

  //Obtenemos el año actual
  actualYear = new Date().getFullYear();

  //Creamos un libro vacío omitiendo el id
  book:Omit<BookAdd,"mediaId"> = {
    title:       '',
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
    gender:['',Validators.required],
    image_url:[null],
    author:['',Validators.required],
    price:[null,[Validators.required,Validators.min(1)]],
    available:[true],
    stock:[null,[Validators.required,Validators.min(1)]]
  })

  //Obtenemos el error en el campo que le pasemos por parámetro
  invalidField(field: string){
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  get stockMessage():string{
    const error = this.myForm.get('stock')?.errors;
    let errorMessage = '';
    if(error){
      if(error['required']){
        errorMessage = 'Stock is required';
      }else if (error['min']){
        errorMessage = 'Min value must be 1';
      }
    }

    return errorMessage
  }

  get priceMessage():string{
    const error = this.myForm.get('price')?.errors;
    let errorMessage = '';
    if(error){
      if(error['required']){
        errorMessage = 'Price is required';
      }else if (error['min']){
        errorMessage = 'Min value must be 1';
      }
    }

    return errorMessage
  }

  //Al cargar la página si el id es distinto de 0 o está definido
  ngOnInit(): void {
    if(this.id != 0 && this.id != undefined){ 
      this.bookService.getBookAdd(this.id).subscribe({
        next:(data)=>{
          this.book = data;
          this.myForm.setValue({ //Asignamos los valores del formulario a los campos del libro que hemos buscado
            title:this.book.title,
            image_url:null,
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
  editBook() {
    if (this.myForm.valid) {
      if (this.image_url) {
        this.uploadService.uploadFile(this.image_url).subscribe({
          next: (response: any) => {
            const image_url = response.secure_url;
            this.image_url = image_url;
            const { ...book } = this.myForm.value;
            this.book = book;
            this.book.imageUrl = image_url;
            this.bookService.putBook(this.book, this.id).subscribe({
              next: (data) => {
                Swal.fire({
                  title: "Good job!",
                  text: "Book updated successfully!",
                  icon: "success",
                  confirmButtonColor: '#428de661'
                });
              },
              error: (err) => {
                Swal.fire({
                  title: "Error",
                  text: "There was an error updating the book. Please try again.",
                  icon: "error",
                  confirmButtonColor: '#428de661'
                });
              }
            });
          },
          error: (err) => {
            Swal.fire({
              title: "Oops...!",
              text: "Error uploading the image!! " + err.message,
              icon: "error",
              confirmButtonColor: '#428de661'
            });
          }
        });
      } else {
        const { ...book } = this.myForm.value;
        this.book = book;
        this.bookService.putBook(this.book, this.id).subscribe({
          next: (data) => {
            Swal.fire({
              title: "Good job!",
              text: "Book updated successfully!",
              icon: "success",
              confirmButtonColor: '#428de661'
            });
          },
          error: (err) => {
            Swal.fire({
              title: "Error",
              text: "There was an error updating the book. Please try again.",
              icon: "error",
              confirmButtonColor: '#428de661'
            });
          }
        });
      }
    }
  }

  addBook() {
    if (this.myForm.valid) {
      if (this.image_url) {
        this.uploadService.uploadFile(this.image_url).subscribe({
          next: (response: any) => {
            const image_url = response.secure_url;
            this.image_url = image_url;
            const { ...book } = this.myForm.value;
            this.book = book;
            this.book.imageUrl = image_url;
            this.bookService.postBook(this.book).subscribe({
              next: (data) => {
                Swal.fire({
                  title: "Good job!",
                  text: "Book added!",
                  icon: "success",
                  confirmButtonColor: '#428de661'
                });
              },
              error: (err) => {
                Swal.fire({
                  title: "Error",
                  text: "There was an error adding the book. Please try again later.",
                  icon: "error",
                  confirmButtonColor: '#428de661'
                });
              }
            });
          },
          error: (err) => {
            Swal.fire({
              title: "Oops...!",
              text: "Error uploading the image!! " + err.message,
              icon: "error",
              confirmButtonColor: '#428de661'
            });
          }
        });
      } else {
        const { ...book } = this.myForm.value;
        this.book = book;
        this.bookService.postBook(this.book).subscribe({
          next: (data) => {
            Swal.fire({
              title: "Good job!",
              text: "Book added!",
              icon: "success",
              confirmButtonColor: '#428de661'
            });
          },
          error: (err) => {
            Swal.fire({
              title: "Error",
              text: "There was an error adding the book. Please try again later.",
              icon: "error",
              confirmButtonColor: '#428de661'
            });
          }
        });
      }
    }
  }

  getFile(event: Event) {
    const input: HTMLInputElement = <HTMLInputElement>event.target;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.image_url = e.target.result;
      }
      reader.readAsDataURL(input.files[0]);
    }
  }
}