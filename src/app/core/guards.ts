import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from './models';
export const authenticated: CanActivateFn = () => { const auth = inject(AuthService); return auth.currentUser() ? true : inject(Router).createUrlTree(['/login']); };
export const roles = (...allowed: Role[]): CanActivateFn => () => { const auth = inject(AuthService); return allowed.includes(auth.role() as Role) ? true : inject(Router).createUrlTree([auth.home()]); };
export const guest: CanActivateFn = () => { const auth = inject(AuthService); return auth.currentUser() ? inject(Router).createUrlTree([auth.home()]) : true; };
