import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../userProfile/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Authentication state
  private authState = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authState.asObservable();

  // User details
  private currentUser = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUser.asObservable();

  private baseUrl = 'http://localhost:8085';

  constructor(
    private http: HttpClient,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.initializeAuthState();
  }

  // Initialize authentication state from localStorage
  private initializeAuthState(): void {
    const isAuthenticated = this.isAuthenticated();
    this.authState.next(isAuthenticated);
    
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
      this.currentUser.next(user);
    }
  }

  // =============== Authentication Methods ===============
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<{ token: string, role: string, email: string }>(
      `${this.baseUrl}/auth/login`, 
      credentials
    ).pipe(
      switchMap(response => {
        this.handleAuthSuccess(response.token, response.role);
        
        // Fetch and store user details after successful login
        return this.getUserByEmail(response.email || credentials.email).pipe(
          tap(user => {
            this.storeUserDetails(user);
          }),
          map(() => response) // Return original response
        );
      }),
      catchError(error => {
        this.clearAuthState();
        return throwError(() => this.handleAuthError(error));
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData).pipe(
      catchError(error => {
        let errorMsg = 'Registration failed';
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.status === 409) {
          errorMsg = 'Email already exists';
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  // =============== User Details Methods ===============
  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/userByEmail/${email}`).pipe(
      catchError(error => {
        console.error('Failed to fetch user details:', error);
        return throwError(() => new Error('Failed to load user profile'));
      })
    );
  }

  refreshUserDetails(): Observable<any> {
    const email = this.currentUser.value?.email;
    if (!email) {
      return throwError(() => new Error('No user email available'));
    }
    
    return this.getUserByEmail(email).pipe(
      tap(user => {
        this.storeUserDetails(user);
      })
    );
  }

  // =============== Helper Methods ===============
  private handleAuthSuccess(token: string, role: string): void {
    this.setToken(token);
    this.setUserRole(role);
    this.authState.next(true);
  }

  private storeUserDetails(user: any): void {
    // Sanitize user data before storing
    const safeUser = {
      ...user,
      // Add any sanitization needed for profile images etc.
    };
    
    localStorage.setItem('currentUser', JSON.stringify(safeUser));
    this.currentUser.next(safeUser);
  }

  private clearAuthState(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.authState.next(false);
    this.currentUser.next(null);
  }

  private handleAuthError(error: any): Error {
    if (error.status === 401) {
      return new Error('Invalid email or password');
    }
    if (error.status === 0) {
      return new Error('Network error - please check your connection');
    }
    return new Error(error.error?.message || 'Authentication failed');
  }

  // =============== Token Management ===============
  setToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  setUserRole(role: string): void {
    localStorage.setItem('userRole', role);
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getCurrentUser(): any {
    return this.currentUser.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch (e) {
      return true;
    }
  }
}