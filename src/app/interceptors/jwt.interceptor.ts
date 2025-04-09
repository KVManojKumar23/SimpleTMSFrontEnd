import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../Service/Auth/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private router = inject(Router);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip interception for auth-related requests
    if (this.isAuthRequest(request.url)) {
      return next.handle(request);
    }

    const token = this.authService.getToken();
    const authReq = token 
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      : request;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.handleAuthError();
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthRequest(url: string): boolean {
    const authUrls = ['/auth/login', '/auth/register', '/oauth2/authorization'];
    return authUrls.some(authUrl => url.includes(authUrl));
  }

  private handleAuthError(): void {
    this.authService.logout();
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }
}