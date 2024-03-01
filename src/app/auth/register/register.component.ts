import { Component } from '@angular/core';
import { UserService } from '../../user/services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, Review, Rental } from '../../user/interfaces/user';
import Swal from 'sweetalert2';
import { ValidatorService } from '../../shared/validators/validator.service';
import { ValidateEmailService } from '../../shared/validators/validate-email.service';
import { ValidateUsernameService } from '../../shared/validators/validate-username.service';
import { UploadService } from '../../books/services/upload.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private emailValidatorService: ValidateEmailService,
    private usernameValidatorService: ValidateUsernameService,
    private validatorService : ValidatorService
  ) {}

  currentDate: Date = new Date();
  
  user: Omit<User, "user_id"> = {
    username: "",
    email: "",
    password: "",
    address: "",
    registration_date: this.currentDate,
    name: "",
    last_name: "",
    role: "user",
    activated: true,
    reviews: [],
    rentals: []
  }

  myForm: FormGroup = this.fb.group({
    username: ['', [Validators.required], [this.usernameValidatorService.validate.bind(this.usernameValidatorService)]],
    email: ['', [Validators.required, Validators.email], [this.emailValidatorService.validate.bind(this.emailValidatorService)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    address: ['', Validators.required],
    registration_date: [this.currentDate],
    name: ['', Validators.required],
    last_name: ['', Validators.required],
    role: ['user'],
    reviews: [[]],
    rentals: [[]],
    confirmPassword: ['', Validators.required]
  }, {validators: [this.validatorService.equalFields('password', 'confirmPassword')]});

  invalidField(field: string) {
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  get EmailErroMsg(): string {
    const error = this.myForm.get('email')?.errors;
    let errorMessage = '';
    if(error) {
      if(error['required']) {
        errorMessage = 'Email is required';
      } else if (error['emailExist']) {
        errorMessage = 'Email already exists';
      } else if (error['email']) {
        errorMessage = 'Email format not valid';
      }
    }
    return errorMessage;
  }

  get UsernameErrorMsg(): string {
    const error = this.myForm.get('username')?.errors;
    let errorMessage = '';
    if(error) {
      if(error['required']) {
        errorMessage = 'Username is required';
      } else if (error['usernameExist']) {
        errorMessage = 'Username already exists';
      }
    }
    return errorMessage;
  }

  register() {
    if(this.myForm.valid) {
      const {...user} = this.myForm.value;
      this.user = user;
      this.userService.postUser(this.user).subscribe({ 
        next: (data) => {
          Swal.fire({
            icon: 'success',
            text: 'User created correctly',
            confirmButtonColor: '#428de661',
          })
          this.myForm.reset();
        }
      })
    }
  }
}
