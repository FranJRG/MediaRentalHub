import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { map } from 'rxjs';

export const validTokenGuard: CanMatchFn = (route, segments) => {
  let authService = inject(AuthService);
  let router = inject(Router);

  return authService.verifyToken().pipe(
    map(isValidToken => {
      console.log(isValidToken);
      if (isValidToken) {
        return true;
      } else {
        Swal.fire({
          title: 'Token error',
          icon:'error',
          text: 'This token is not valid!'
        });
        authService.logout();
        return false;
      }
    })
  );
};
