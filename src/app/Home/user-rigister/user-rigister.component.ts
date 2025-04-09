import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Service/Auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-rigister',
  standalone: false,
  templateUrl: './user-rigister.component.html',
  styleUrl: './user-rigister.component.css'
})
export class UserRigisterComponent {
  signupForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage: string | null = null;
  minDate: string;
  maxDate: string;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    // Calculate date range for date of birth (18+ years)
    const currentDate = new Date();
    this.maxDate = this.datePipe.transform(new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate()), 'yyyy-MM-dd')!;
    this.minDate = this.datePipe.transform(new Date(currentDate.getFullYear() - 120, currentDate.getMonth(), currentDate.getDate()), 'yyyy-MM-dd')!;

    this.initializeForm();
  }

  private initializeForm(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10,15}$/)
      ]],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      gender: ['MALE', Validators.required],
      dateOfBirth: ['', [
        Validators.required,
        this.minimumAgeValidator(18)
      ]],
      orgID: [1] // Default organization ID or get from service
    }, {
      validators: [this.passwordMatchValidator]
    });
  }
   // Custom validator for password strength
   private passwordStrengthValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    return valid ? null : { passwordStrength: true };
  }

  // Custom validator for minimum age
  private minimumAgeValidator(minAge: number): (control: AbstractControl) => { [key: string]: boolean } | null {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) return null;

      const today = new Date();
      const birthDate = new Date(control.value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= minAge ? null : { underage: true };
    };
  }

  // Custom validator for password matching
  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword 
      ? { passwordMismatch: true } 
      : null;
  }

  // Convenience getters for form controls
  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get phoneNumber() { return this.signupForm.get('phoneNumber'); }
  get address() { return this.signupForm.get('address'); }
  get gender() { return this.signupForm.get('gender'); }
  get dateOfBirth() { return this.signupForm.get('dateOfBirth'); }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Prepare DTO
    const formValue = this.signupForm.value;
    const userData: any = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      phoneNumber: formValue.phoneNumber,
      address: formValue.address,
      gender: formValue.gender,
      dateOfBirth: formValue.dateOfBirth,
      orgID: formValue.orgID
    };

    // Call registration service
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('Registration successful! Please login.', 'Close', { duration: 5000 });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.handleRegistrationError(error);
      }
    });
  }

  private handleRegistrationError(error: any): void {
    if (error.status === 400 && error.error?.message) {
      this.errorMessage = error.error.message;
    } else if (error.status === 409) {
      this.errorMessage = 'This email is already registered. Please use a different email or login.';
    } else {
      this.errorMessage = 'Registration failed. Please try again later.';
    }

    // Show error in snackbar and scroll to message
    this.snackBar.open(this.errorMessage!, 'Close', { duration: 5000 });
    setTimeout(() => {
      const errorElement = document.querySelector('.alert-danger');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }
}

