import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private router: Router) {}

  private isTokenValid(token: string | null): boolean {
    if (!token) return false;

    
    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) return true; 

      
      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');

      const payload = JSON.parse(atob(padded));
      if (!payload?.exp) return true;

      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  }

  private checkAccess(url: string): boolean | UrlTree {
    const token = localStorage.getItem('token');

    if (this.isTokenValid(token)) return true;

    
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    
    return this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: url },
    });
  }

  canActivate(_: any, state: any): boolean | UrlTree {
    return this.checkAccess(state.url);
  }

  canActivateChild(_: any, state: any): boolean | UrlTree {
    return this.checkAccess(state.url);
  }
}
