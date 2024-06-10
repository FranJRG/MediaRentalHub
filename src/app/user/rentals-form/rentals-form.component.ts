import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { RentalService } from '../../media/services/rental.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rentals-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rentals-form.component.html',
  styleUrl: './rentals-form.component.css',
})
export class RentalsFormComponent implements OnInit{
  user!: User;
  limitDate!: Date;
  rentalDate!: Date;

  currentDate: Date = new Date();

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private rentalService: RentalService
  ) {}

  ngOnInit(): void {
    let idUser = this.authService.getUserId();
    this.userService.getUser(idUser).subscribe({
      next: (data) => {
        this.user = data;
        console.log(this.user)
      },
    });
  }

  devolveMedia(id: number) {
    this.rentalService.deleteRental(id).subscribe({
      next: () => {
        this.user.rentals = this.user.rentals.filter(
          (rental) => rental.mediaId != id
        );
        Swal.fire({
          title: 'Returned',
          text: 'We hope you enjoyed it',
          icon: 'success',
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Failed',
          text: 'Something went wrong',
          icon: 'error',
        });
      },
    });
  }
}
