import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidateEmailService implements AsyncValidator{

  constructor(private http:HttpClient) { }

  validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> { //Validador asincrono para validar el email
    const email = control.value;

    return this.http.get<any[]>(`http://localhost:8080/userEmail/${email}`).pipe( //Buscamos el usuario por el email
      map(resp => {
        return resp.length === 0 ? null : {emailExist : true} //Si la longitud de la respuesta es mayor a 0 es decir que existe no permitimos ese email
      })
    )
    
  }
}
