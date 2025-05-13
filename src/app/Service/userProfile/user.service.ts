import { formatDate } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserDTO } from '../../Models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8085'; 

  constructor(private http: HttpClient) { }

  getUserByID(ID: number): Observable<any> {
    // Get JWT token from storage
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
      return throwError(() => new Error('No access token found'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/users/userById/${ID}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';
        
        if (error.status === 0) {
          errorMessage = 'Network error - could not connect to server';
        } else if (error.status === 403) {
          errorMessage = 'You can only access your own profile';
        } else if (error.status === 404) {
          errorMessage = 'User not found';
        } else {
          errorMessage = error.error?.message || error.message;
        }

        console.error('Error fetching user:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }


}
