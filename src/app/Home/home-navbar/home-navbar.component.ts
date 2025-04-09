import { Component, HostListener, Inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../Service/Auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../Service/userProfile/user.service';

@Component({
  selector: 'app-home-navbar',
  standalone: false,
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.css',
})
export class HomeNavbarComponent {
  isMenuCollapsed = true;
  isAuthenticated$: Observable<boolean>;
  user = false;
  showMobileMenu = false;
 
  profile: any;
  error: string | null = null;
  isLoading = false;
  
  menuItems = [
    { path: '/home', label: 'Home', icon: 'house' },
    { path: '/about', label: 'About', icon: 'info-circle' },
    { path: '/contact', label: 'Contact', icon: 'envelope' },
  ];

  constructor(public authService: AuthService, 
    private router: Router,
    private profileService: UserService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$; // ✅ Directly assign Observable
  }

  ngOnInit(): void {
    this.isAuthenticated$.subscribe((authenticated) => {
      console.log('Auth state changed:', authenticated);
    });
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.error = null;
    
  }

  // Local method to handle image errors
  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-profile.png';
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  logout(): void {
    this.showMobileMenu = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.d-block.d-md-none')) {
      this.showMobileMenu = false;
    }
  }

  isSmallScreen(): boolean {
    return window.innerWidth < 919; // Adjust breakpoint as needed
  }
}
