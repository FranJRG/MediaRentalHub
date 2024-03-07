import { HttpInterceptorFn } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(NgxUiLoaderService);
  loader.start();
  //Obtenemos el token del localStorage
  const token = localStorage.getItem('token');
  if(token){ //Si existe
    req = req.clone({
      setHeaders: {Authorization : token} //Lo añadimos a la cabecera
    })
  }
  return next(req).pipe(finalize(() => loader.stop()));
};
