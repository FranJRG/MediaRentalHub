import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private router:Router,
    private authService:AuthService,
    private fb:FormBuilder){}
    
    //Enlazamos nuestro formulario con el html utilizando la anotacion ViewChield para formularios de tipo template
    @ViewChild("myForm")myForm!:NgForm
    
    //Funcion login
    login(){
      if(this.myForm.valid){
        const {username, password} = this.myForm.value //Extraemos los datos de username y password del formulario y lo asignamos a un objeto
        this.authService.login(username,password) //Utilizamos la funcion login de nuestro service
        .subscribe(
          resp => {
            if(resp === true){
              this.router.navigateByUrl('/home') //Si la respuesta es correcta navegamos al home
            }else{
              Swal.fire({
                title:'Error!',
                text:'Something go bad',
                icon:'error',
                confirmButtonText:"Accept" //Mandamos un mensaje de error en caso de no ser un usuario válido
              })
            }
          }
        )
      }
    }
    
    //Ruta para volver al home si el usuario no quisiese loguearse
    goHome(){
      this.router.navigateByUrl('/');
    }
    
    //Ruta para el registro
    goTo(){
      this.router.navigateByUrl('/auth/register');
    }
}
