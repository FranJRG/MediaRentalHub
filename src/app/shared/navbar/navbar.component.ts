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

  toLogin():boolean{
    return this.router.url==='/auth/login'
  }

  isAdmin():boolean{
    return this.authService.isAdmin();
  }

  username():string{
    return this.authService.getUser();
  }

  idUser():number{
    return this.authService.getUserId();
  }

  isLogin():boolean{
    return this.authService.isLogin();
  }

  logout(){
    this.authService.logout();
  }

}
