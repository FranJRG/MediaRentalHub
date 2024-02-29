import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorService } from '../../shared/validators/validator.service';
import { ValidateEmailService } from '../../shared/validators/validate-email.service';
import { ValidateUsernameService } from '../../shared/validators/validate-username.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modify-user',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './modify-user.component.html',
  styleUrl: './modify-user.component.css',
})
export class ModifyUserComponent implements OnInit {

  @Input() id: number = 0;

  user: Omit<User, 'user_id' | "registration_date" | "password" | "rentals" | "reviews" | "activated"> = {
    username: '',
    email: '',
    address: '',
    name: '',
    last_name: '',
    role: ''
  };

  constructor(
    private userService: UserService,
    private validations: ValidatorService,
    private emailValidatorService: ValidateEmailService,
    private usernameValidatorService: ValidateUsernameService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userService.getUser(this.id).subscribe({
      next: (data) => {
        this.user = data;
        this.myForm.setValue({
          username:this.user.username,
          email:this.user.email,
          address:this.user.address,
          name:this.user.name,
          last_name:this.user.last_name,
          role:this.user.role
        })
      }
    })
  }

  myForm:FormGroup = this.fb.group({
    username:['',Validators.required],
    email:['',[Validators.required,Validators.pattern(this.validations.emailPattern)]],
    address:['',Validators.required],
    name:['',Validators.required],
    last_name:['',Validators.required],
    role:['',Validators.required]
  })


  updateUser(){
    if(this.myForm.valid){
      const {...user} = this.myForm.value;
      this.user = user;
      this.userService.putUser(this.user,this.id).subscribe({
        next: (data) => {
          Swal.fire({
            title: "Good job!",
            text: "User update succesfully!",
            icon: "success",
          })
        },
        error: (err) => {
          Swal.fire({
            title: "Error",
            text: "There was an error updating the user. Please try again later.",
            icon: "error",
          });
        }
      })
    }
  }
}
