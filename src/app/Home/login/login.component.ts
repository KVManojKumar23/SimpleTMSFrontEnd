import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Service/Auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    
  }

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;
      
      this.authService.login({ email, password }).subscribe({
        next: (response: any) => {
          this.handleAuthSuccess(response);
        },
        error: (err) => {
          this.handleAuthError(err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private handleAuthSuccess(response: any): void {
    this.authService.setToken(response.token);
    this.authService.setUserRole(response.role || response.user?.role?.roleName);
    this.redirectBasedOnRole(response.role || response.user?.role?.roleName);
    this.isLoading = false;
  }

  private handleAuthError(err: any): void {
    this.errorMessage = err.error?.message || 
                       err.message || 
                       'Authentication failed. Please try again.';
    this.isLoading = false;
  }

  private redirectBasedOnRole(role: string): void {
    const normalizedRole = role?.toUpperCase();
    switch (normalizedRole) {
      case 'ADMIN':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'USER':
        this.router.navigate(['/user']);
        break;
      case 'EMPLOYEE':
        this.router.navigate(['/employee-dashboard']);
        break;
      case 'MANAGEMENT':
        this.router.navigate(['/management-dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
