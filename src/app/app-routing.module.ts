import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeLayoutComponent } from './Home/home-layout/home-layout.component';
import { HomeAboutComponent } from './Home/home-about/home-about.component';
import { HomeConatctUsComponent } from './Home/home-conatct-us/home-conatct-us.component';
import { LoginComponent } from './Home/login/login.component';
import { HomeContentComponent } from './Home/home-content/home-content.component';
import { UserComponent } from './Home/user/user.component';
import { UserRigisterComponent } from './Home/user-rigister/user-rigister.component';
import { RoleGuard } from './guards/role/role.guard';
import { UserLayoutComponent } from './Home/user-layout/user-layout.component';

const routes: Routes = [
   // Home Routes
   {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: '', component: HomeContentComponent },
      { path: 'about', component: HomeAboutComponent },
      { path: 'contact', component: HomeConatctUsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: UserRigisterComponent}
    ]
  },
  {
    path: 'user',
    canActivate: [RoleGuard], // ✅ Guard applies to all child routes
    data: { expectedRole: 'USER' },
    component: UserLayoutComponent, // Parent layout component
    children: [
      { path: '', component: UserComponent }
    ]
  },
  {
    path: 'admin',
    canActivate: [RoleGuard], // ✅ Guard applies to all child routes
    data: { expectedRole: 'ADMIN' },
    component: UserLayoutComponent, // Parent layout component
    children: [
      { path: '', component: UserComponent }, // Default route
    ]
  },


  { path: '**', redirectTo: '' }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
