import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidateEmailService implements AsyncValidator{

  constructor(private http:HttpClient) { }

  validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> {
    const email = control.value;
  
    return this.http.get<any[]>(`http://localhost:8080/userEmail/${email}`).pipe(
      map(resp => {
        return resp.length === 0 ? null : { emailExist: true };
      }),
      catchError(err => {
        return of(null);
      })
    );
  }
}
