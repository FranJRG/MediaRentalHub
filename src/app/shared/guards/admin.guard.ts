import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import Swal from 'sweetalert2';

export const adminGuard: CanMatchFn = (route, segments) => {
  //Inyectamos lo que necesitemos
  const authService = inject(AuthService);
  const router = inject(Router);

  const admin = authService.isAdmin(); //Llamamos a la funcion de isAdmin

  if (admin === true) { //Comprobamos que el rol del usuario sea admin
    return true;
  } else {
    Swal.fire({ //Mensaje de error en caso de no tener acceso permitido
      text: 'Access denied',
      icon: 'error',
    });
    router.navigate(['/']); //Lo devolvemos al index
    return false;
  }
};
