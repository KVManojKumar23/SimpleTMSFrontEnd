import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../Service/Auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean {
    // 1. Check authentication first
    if (!this.authService.isAuthenticated()) {
      this.redirectToLogin(state.url);
      return false;
    }

    // 2. Get user role with null check
    const userRole = this.authService.getUserRole();
    if (!userRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    // 3. Get expected roles
    const expectedRoles = this.getExpectedRoles(route);
    
    // 4. Check role against expected roles
    if (!expectedRoles.includes(userRole)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }

  private getExpectedRoles(route: ActivatedRouteSnapshot): string[] {
    const roles = route.data['expectedRoles'] || route.data['expectedRole'];
    
    if (!roles) {
      console.warn('No expected roles defined for route:', route);
      return [];
    }

    return Array.isArray(roles) ? roles : [roles];
  }

  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: returnUrl } 
    });
  }
}