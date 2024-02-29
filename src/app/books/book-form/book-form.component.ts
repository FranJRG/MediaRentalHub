import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../services/book.service';
import { Book } from '../interfaces/book';
import Swal from 'sweetalert2';
import { ValidateTitleService } from '../services/validators/validate-title.service';
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

  //Obtenemos el id de la ruta si esque existe
  @Input()id:number = 0;

  //Creamos una imagen vacía
  imageUrl : string = ''

  constructor(private bookService:BookService,
    private titleValidator:ValidateTitleService,
    private uploadService:UploadService,
    private fb:FormBuilder){}

  actualYear = new Date().getFullYear();

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

  invalidField(field: string){
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  ngOnInit(): void {
    if(this.id != 0 && this.id != undefined){
      this.bookService.getBook(this.id).subscribe({
        next:(data)=>{
          this.book = data;
          this.myForm.setValue({
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

  editBook(){
    if (this.myForm.valid) {
      this.uploadService.uploadFile(this.imageUrl).subscribe({
        next: (response:any) => {
          const imageUrl = response.secure_url;
          this.imageUrl = imageUrl;
          const {...book} = this.myForm.value;
          this.book = book;
          this.book.imageUrl = imageUrl; 
          this.bookService.putBook(this.book,this.id).subscribe({
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


  addBook() {
    if (this.myForm.valid) {
      this.uploadService.uploadFile(this.imageUrl).subscribe({
        next: (response:any) => {
          const imageUrl = response.secure_url;
          this.imageUrl = imageUrl;
          const {...book} = this.myForm.value;
          this.book = book;
          this.book.imageUrl = imageUrl; 
          this.bookService.postBook(this.book).subscribe({
            next: (data) => {
              Swal.fire({
                title: "Good job!",
                text: "Book added!",
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
