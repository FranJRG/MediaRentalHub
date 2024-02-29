import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

  equalFields (field1: string, field2: string) : ValidatorFn{
    return (formControl: AbstractControl): ValidationErrors | null => {
      const control2 : FormControl = <FormControl>formControl.get(field2);
      const field1Input : string = formControl.get(field1)?.value;
      const field2Input : string = control2?.value;
  
      if (field1Input !== field2Input) {
        control2.setErrors({ nonEquals: true})
        return { nonEquals: true};
        
      }
      
      if(control2?.errors && control2.hasError('nonEquals')) {
        delete control2.errors['nonEquals'];
        control2.updateValueAndValidity();
      }
      return null
    }
  }

  constructor() { }
}
