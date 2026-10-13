import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AUTH_SERVICE, type AuthService } from '@thydda/auth-contracts';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject<AuthService>(AUTH_SERVICE);
  return auth.user()
    ? true
    : inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
