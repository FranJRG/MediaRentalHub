import { HttpInterceptorFn } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(NgxUiLoaderService);
  const authService = inject(AuthService);
  loader.start();

  if(!req.url.includes("api.cloudinary.com")){
    const token = localStorage.getItem('token');
    if(token){ //Si existe
      req = req.clone({
        setHeaders: {Authorization : token} //Lo añadimos a la cabecera
      })
    }
  } 
  //Obtenemos el token del localStorage
  return next(req).pipe(finalize(() => loader.stop()), //Paramos el loader
          catchError((err) => {
            console.log(err.status);
            if(err.status == 401){ //Manejo del error 401 para token no válidos
              Swal.fire({
                icon:'error',
                title:'Bad credentials',
                text:'Token not valid'
              })
              authService.logout();
            }
            return throwError(() => err);
          })
        );
};
