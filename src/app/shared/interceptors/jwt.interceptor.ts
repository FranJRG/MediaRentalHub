import { HttpInterceptorFn } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(NgxUiLoaderService);
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
  return next(req).pipe(finalize(() => loader.stop()));
};
