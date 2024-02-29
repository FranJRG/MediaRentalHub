import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const jwtGuard: CanMatchFn = (route, segments) => {
  //Inyectamos los servicios necesarios
  const authService = inject(AuthService);
  const router = inject(Router);
  
  //Llamamos al método para ver si está logueado
  const login = authService.isLogin();

  //Si el login es true nos dejará pasar en caso contrario nos devolverá al login
  return login ? true : router.navigateByUrl('auth/login'); 
};
