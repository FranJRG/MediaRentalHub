import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  constructor(private router:Router){}

  //Cuando estemos en la ruta login no mostaremos el footer
  toLogin():boolean{
    return this.router.url==='/auth/login'
  }

}
