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

  //Variable para rescatar el id de la url
  @Input() id: number = 0;

  //Creamos un usuario omitiendo los campos que no queremos que aparezcan
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

  //Al cargar la página mostramos los datos del usuario
  ngOnInit(): void {
    this.userService.getUser(this.id).subscribe({
      next: (data) => {
        this.user = data;
        this.myForm.setValue({ //Asignamos los datos al formulario
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

  //Creamos un formulario con los campos necesarios
  myForm:FormGroup = this.fb.group({
    username:['',Validators.required],
    email:['',[Validators.required,Validators.pattern(this.validations.emailPattern)]],
    address:['',Validators.required],
    name:['',Validators.required],
    last_name:['',Validators.required],
    role:['',Validators.required]
  })


  //Actualizamos el usuario
  updateUser(){
    if(this.myForm.valid){
      const {...user} = this.myForm.value; //Asignamos los datos del usuario a un objeto user
      this.user = user; //Lo asignamos a nuestro user
      this.userService.putUser(this.user,this.id).subscribe({
        next: (data) => {
          Swal.fire({ //Mostramos un mensaje de éxito en caso de ser válido
            title: "Good job!",
            text: "User update succesfully!",
            icon: "success",
          })
        },
        error: (err) => {
          if(err.status != 401){
          Swal.fire({
            title: "Error",
            text: "There was an error updating the user. Please try again later.",
            icon: "error",
          });
        }
        }
      })
    }
  }
}
