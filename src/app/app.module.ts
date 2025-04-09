import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeLayoutComponent } from './Home/home-layout/home-layout.component';
import { HomeNavbarComponent } from './Home/home-navbar/home-navbar.component';
import { HomeFooterComponent } from './Home/home-footer/home-footer.component';
import { HomeAboutComponent } from './Home/home-about/home-about.component';
import { HomeConatctUsComponent } from './Home/home-conatct-us/home-conatct-us.component';
import { UserComponent } from './Home/user/user.component';
import { UserRigisterComponent } from './Home/user-rigister/user-rigister.component';
import { LoginComponent } from './Home/login/login.component';
import { HomeContentComponent } from './Home/home-content/home-content.component';
import { MaterialModule } from './material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { UserLayoutComponent } from './Home/user-layout/user-layout.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { CommonModule, DatePipe } from '@angular/common';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    HomeLayoutComponent,
    HomeNavbarComponent,
    HomeFooterComponent,
    HomeAboutComponent,
    HomeConatctUsComponent,
    UserComponent,
    UserRigisterComponent,
    HomeContentComponent,
    UserLayoutComponent,
    LoginComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TruncatePipe,
    FormsModule,
    CommonModule
   
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true  // Important for multiple interceptors
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
