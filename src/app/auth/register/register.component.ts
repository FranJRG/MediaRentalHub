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

  constructor(private userService:UserService,
  private validations:ValidatorService,
  private emailValidatorService:ValidateEmailService,
  private usernameValidatorService:ValidateUsernameService,
  private fb:FormBuilder){}

  //Variable para extraer la fecha actual;
  currentDate:Date = new Date();
  
  //Inicializamos un user vacío con omit del id ya que es autoincrementado
  user:Omit<User,"user_id"> = {
    username:"",
    email:"",
    password:"",
    address:"",
    registration_date:this.currentDate,
    name:"",
    last_name:"",
    role:"user",
    activated:true,
    reviews: [],
    rentals: []
  }

  //Creamos nuestro formulario reactivo con los campos necesarios para crear un usuario
  myForm:FormGroup = this.fb.group({
    username:['',Validators.required],
    email:['',[Validators.required,Validators.pattern(this.validations.emailPattern)]], //Validamos que el email sea válido
    password:['',[Validators.required,Validators.minLength(8)]], //La longitud mínima de la contraseña será de 8
    address:['',Validators.required],
    registration_date:[this.currentDate],
    name:['',Validators.required],
    last_name:['',Validators.required],
    role:['user'],
    reviews:[[]],
    rentals:[[]],
    confirmPassword:['',Validators.required]
  },{validators:[this.validations.equalFields('password','confirmPassword')]}) //Validamos que la contraseña y la confirmación sean iguales

  //Si hay algún campo inválido mostramos el error
  invalidField(field: string){
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  //Como el correo tiene varias validaciones, le decimos que mensaje mostrará según el error
  get EmailErroMsg():string{
    const error = this.myForm.get('email')?.errors;
    let errorMessage = '';
    if(error){
      if(error['required']){
        errorMessage = 'Email is required';
      }else if (error['emailExist']){
        errorMessage = 'Email already exist';
      }else if (error['pattern']) {
        errorMessage = 'Email format not valid';
      }
    }

    return errorMessage
  }

  //Método para el registro de usuario
  register(){
    if(this.myForm.valid){
      const {...user} = this.myForm.value; //Hacemos una copia del usuario y le asignamos los valores del formulario
      this.user = user; //Igualamos el usuario vacío a este usuario
      this.userService.postUser(this.user).subscribe({ 
        next:(data) => {
          Swal.fire({
            icon:'success',
            text:'User created correctly' //Mostramos un mensaje de éxito cuando el usuario haya sido registrado satisfactoriamente
          })
          this.myForm.reset();  //Reseteamos el formulario
        }
      })
    }
  }



}
