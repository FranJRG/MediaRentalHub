import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import Swal from 'sweetalert2';

export const adminGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const admin = authService.isAdmin();

  if (admin === true) {
    return true;
  } else {
    Swal.fire({
      text: 'Access denied',
      icon: 'error',
    });
    router.navigate(['/']); 
    return false;
  }
};
