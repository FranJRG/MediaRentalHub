import { Injectable } from '@angular/core';
import { LoginResponse, User } from '../../user/interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://proyectoapi-franjrg.onrender.com/signin'; //Ruta para loguearnos
  private _user!:User;

  get user():User{
    return { ...this._user } 
  }

  constructor(private http:HttpClient, private router:Router) { }

  storage(resp:LoginResponse){ //Almacenamos el token en el localstorage
    localStorage.setItem('token',resp.token) //Seteamos el localstorage con un token
    this._user = resp.user //Igualamos el usuario a la respuesta que obtenemos;
  }

  //Método para loguear un usuario
  login(username:string,password:string):Observable<Boolean | null> {
    return this.http.post<LoginResponse>(this.baseUrl,{username, password}).pipe( //Hacemos un post de un tipo LoginResponse que solo contiene username y password
      tap(resp => {
        this.storage(resp) //Almacenamos la respuesta en nuestro storage
      }),
      map(resp => true), //Devolvemos true
      catchError(err => of(err.error.msg)) //Manejamos errores
    )
  }

  //Comprobar si un usuario es admin
  isAdmin(): boolean {
    const token = localStorage.getItem('token'); //Obtenemos el token del localstorage
    if (token && typeof token === 'string') { //Comprobamos que el token exista y sea de tipo string
      const role = (jwtDecode(token) as any).role; //Descodificamos y obtenemos el rol
      return role === 'admin'; //Devolvemos true si el role es equivalente a admin
    }
    return false;
  }

  //Obtenemos el usuario
  getUser(): string {
    const token = localStorage ? localStorage.getItem("token") : null; //Obtenemos el token del localstorage
    return token ? (jwtDecode(token) as any).sub : ''; //Obtenemos la propiedad sub del token descodificado
  }

  //Obtenemos el id del usuario
  getUserId(): number {
    const token = localStorage ? localStorage.getItem("token") : null; //Creamos una variable token y le asignamos el token de localstorage
    return token ? (jwtDecode(token) as any).user_id : ''; //Descodificamos el token y obtenemos el user_id
  }

  //Método para comprobar que el usuario este logueado
  isLogin():boolean{ 
    const token = localStorage ? localStorage.getItem("token") : null; //Si hay un token en el localstorage
    if(token){
      return true; //devolvemos true
    }else{
      return false; //devolvemos false
    }
  }
  
  //Método para el logout
  logout(){
    localStorage.removeItem('token'); //Eliminamos el token del localstorage
    this.router.navigateByUrl('/auth/login'); //Devolvemos al usuario al login
  }
}
