import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../user/interfaces/user';
import { UserService } from '../../user/services/user.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router:Router,
    private authService:AuthService){}

  //Cuando estemos en la ruta login no mostraremos el navbar
  toLogin():boolean{
    return this.router.url==='/auth/login'
  }

  //Comprobamos que sea admin
  isAdmin():boolean{
    return this.authService.isAdmin();
  }

  //Obtenemos el username
  username():string{
    return this.authService.getUser();
  }

  //Obtenemos el id del usuario logueado
  idUser():number{
    return this.authService.getUserId();
  }

  //Comprobamos que este logueado
  isLogin():boolean{
    return this.authService.isLogin();
  }

  //Función para realizar el logout
  logout(){
    this.authService.logout();
  }

}
