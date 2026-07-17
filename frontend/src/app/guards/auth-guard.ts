import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService)

  if (authService.isLoggedIn()) {
    return true;
  }

  toastr.warning('Please login first', 'Authentication Required')

  router.navigate(['/login']);
  return false;
};