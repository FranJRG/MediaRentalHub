import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidateUsernameService implements AsyncValidator{

  constructor(private http:HttpClient) { }

  validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> { //Validador asincrono para el username existente
    const username = control.value;

    return this.http.get<any[]>(`http://localhost:8080/users?username=${username}`).pipe( //Buscamos el usuario por el username
      map(resp => {
        return resp.length === 0 ? null : {usernameExist : true} // Si la longitud de la respuesta es mayor a 0 no dejamos que escoga el
      })
    )
  }

}
