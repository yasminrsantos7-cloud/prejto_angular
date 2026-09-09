import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const autenticado = sessionStorage.getItem('autenticado') === 'true';

  return autenticado ? true : router.createUrlTree(['/login']);
};