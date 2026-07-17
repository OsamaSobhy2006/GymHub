import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);
  const toastr = inject(ToastrService);

  const token = localStorage.getItem('access_token');

  if (!token) {

    toastr.warning(
      'Please login first.',
      'Authentication Required'
    );

    router.navigate(['/login']);

    return false;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));

  if (payload.role !== 'ADMIN') {

    toastr.error(
      'Access denied.',
      'Forbidden'
    );

    router.navigate(['/']);

    return false;
  }

  return true;

};