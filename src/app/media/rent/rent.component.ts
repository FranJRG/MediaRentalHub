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

  currentDate = new Date();
  limitDate = new Date(this.currentDate.getTime() + 10 * 24 * 60 * 60 * 1000);

  
  constructor(
    private mediaService: MediaService,
    private rentalService: RentalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      userId: [this.authService.getUserId()],
      mediaId: [this.id],
      rentalDate: [this.currentDate],
      returnDate: [this.limitDate],
      quantity: [1],
    });

    this.rental = {
      userId: this.authService.getUserId(),
      mediaId: this.id,
      rentalDate: this.currentDate,
      returnDate: this.limitDate,
      quantity: 1,
      returned:false
    };

    this.mediaService.getMedia(this.id).subscribe({
      next: (data) => {
        this.media = data;
      },
    });
  }

  showPurchase() {
    Swal.fire({
      title: 'Confirm your rent',
      html: `
        <label>User id</label>
        <input type="text" id="swal-userId" class="swal2-input" value="${this.rental.userId}" readonly>
        <label>Media id</label>
        <input type="text" id="swal-mediaId" class="swal2-input" value="${this.id}" readonly>
        <label>Rental date</label>
        <input type="text" id="swal-rentalDate" class="swal2-input" value="${this.currentDate}" readonly>
        <label>Return date</label>
        <input type="text" id="swal-returnDate" class="swal2-input" value="${this.limitDate}" readonly>
        <label>Quantity</label>
        <input type="number" id="swal-quantity" class="swal2-input" value="${this.myForm.get('quantity')?.value}" readonly>
      `,
      confirmButtonText: 'Confirm',
      focusConfirm: false,
      preConfirm: () => {
        const userId = (document.getElementById('swal-userId') as HTMLInputElement).value;
        const mediaId = (document.getElementById('swal-mediaId') as HTMLInputElement).value;
        const rentalDate = (document.getElementById('swal-rentalDate') as HTMLInputElement).value;
        const returnDate = (document.getElementById('swal-returnDate') as HTMLInputElement).value;
        const quantity = (document.getElementById('swal-quantity') as HTMLInputElement).value;
        this.rentMedia(); // Llama a tu función para realizar la renta aquí
      }
    });
  }

  rentMedia() {
    if (this.myForm.valid) {
      const { ...rental } = this.myForm.value;
      this.rental = rental;
      this.rentalService.postRental(this.rental).subscribe({
        next: (data) => {
          this.rental.mediaId = data.mediaId;
          Swal.fire({
            icon: 'success',
            title:'Rent complete!',
            text: 'Enjoy it!',
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title:'Rent error',
            text: 'Something went wrong, please try again',
          });
        },
      });
    }
  }

  
  

  goTo() {
    this.router.navigateByUrl('/');
  }
}
