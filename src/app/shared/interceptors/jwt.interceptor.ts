import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  //Obtenemos el token del localStorage
  const token = localStorage.getItem('token');
  if(token){ //Si existe
    req = req.clone({
      setHeaders: {Authorization : token} //Lo añadimos a la cabecera
    })
  }
  return next(req);
};
