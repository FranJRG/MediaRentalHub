import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Movie } from '../../movies/interfaces/movie';
import { MediaService } from '../../shared/services/media.service';
import { RentalService } from '../services/rental.service';
import { Media, Rental } from '../../user/interfaces/user';
import { AuthService } from '../../auth/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rent',
  standalone: true,
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './rent.component.html',
  styleUrl: './rent.component.css',
})
export class RentComponent implements OnInit {
  @Input() id: number = 0;
  media!: Media;
  rental!:Omit<Rental, "rentalId">;
  myForm!: FormGroup;
  show:boolean = false;

  //Variable de la fecha actual y la fecha limite que tenemos
  currentDate = new Date();
  limitDate = new Date(this.currentDate.getTime() + 10 * 24 * 60 * 60 * 1000);

  
  constructor(
    private mediaService: MediaService,
    private rentalService: RentalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  //Al cargar la página mostramos los datos de la media y le asignamos los datos a la renta
  ngOnInit(): void {
    this.myForm = this.fb.group({ //Creamos el formulario con los valores por defecto
      userId: [this.authService.getUserId()],
      mediaId: [this.id],
      rentalDate: [this.currentDate],
      returnDate: [this.limitDate],
      quantity: [1],
    });

    this.rental = { //Creamos la renta con los valores por defecto
      userId: this.authService.getUserId(),
      mediaId: this.id,
      rentalDate: this.currentDate,
      returnDate: this.limitDate,
      quantity: 1,
      returned:false
    };

    this.mediaService.getMedia(this.id).subscribe({ //Rescatamos los datos de la media que queremos comprar 
      next: (data) => {
        this.media = data;
      },
    });
  }

  //Método para mostrar el resumen de la compra para confirmarla
  showPurchase() {
    Swal.fire({
      title: 'Confirm your rent',
      //Estructura del html
      html: `
      <div class="form-group">
        <label for="swal-userId">User id</label>
        <input type="text" id="swal-userId" class="form-control" value="${this.rental.userId}" readonly>
      </div>
      <br>
      <div class="form-group">
          <label for="swal-mediaId">Media id</label>
          <input type="text" id="swal-mediaId" class="form-control" value="${this.id}" readonly>
      </div>
      <br>
      <div class="form-group">
          <label for="swal-rentalDate">Rental date</label>
          <input type="text" id="swal-rentalDate" class="form-control" value="${this.currentDate}" readonly>
      </div>
      <br>
      <div class="form-group">
          <label for="swal-returnDate">Return date</label>
          <input type="text" id="swal-returnDate" class="form-control" value="${this.limitDate}" readonly>
      </div>
      
      <div class="form-group">
          <label for="swal-quantity">Quantity</label>
          <input type="number" id="swal-quantity" class="form-control" value="${this.myForm.get('quantity')?.value}" readonly>
      </div>
      `,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#428de661',
      focusConfirm: false,
      preConfirm: () => { //Asignamos los valores a los campos de la renta
        const userId = (document.getElementById('swal-userId') as HTMLInputElement).value;
        const mediaId = (document.getElementById('swal-mediaId') as HTMLInputElement).value;
        const rentalDate = (document.getElementById('swal-rentalDate') as HTMLInputElement).value;
        const returnDate = (document.getElementById('swal-returnDate') as HTMLInputElement).value;
        const quantity = (document.getElementById('swal-quantity') as HTMLInputElement).value;
        this.rentMedia(); // Llama a tu función para realizar la renta aquí
      }
    });
  }

  //Método para alquilar una media
  rentMedia() {
    if (this.myForm.valid) {
      const { ...rental } = this.myForm.value; //Asignamos los valores del formulario a la renta
      this.rental = rental;
      this.rentalService.postRental(this.rental).subscribe({ //La añadimos
        next: (data) => {
          this.rental.mediaId = data.mediaId; //Asignamos el id de la media a la renta
          Swal.fire({ //Mostramos mensaje de éxito
            icon: 'success',
            title:'Rent complete!',
            text: 'Enjoy it!',
          });
        },
        error: (err) => { //Mensaje de error en caso de contener errores
          if(err.status != 401){
          Swal.fire({
            icon: 'error',
            title:'Rent error',
            text: 'Something went wrong, please try again',
          });
        }
        },
      });
    }
  }

  //Método para volver al home
  goTo() {
    this.router.navigateByUrl('/');
  }
}
