import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidateTitleService implements AsyncValidator{

  constructor(private http:HttpClient) { }

  validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> {
    const title = control.value;

    return this.http.get<any[]>(`http://localhost:8080/movies?title=${title}`).pipe(
      map((resp)=>{
        return resp.length === 0 ? null : {titleExist : true}
      })
    )

  }

}
