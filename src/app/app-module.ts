import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './components/home/home';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Sidebar } from './components/sidebar/sidebar';
import { Material } from './components/material/material';
import { DashboardLayout } from './components/dashboard-layout/dashboard-layout';
import { AuthLayout } from './components/auth-layout/auth-layout';
import { NotFound } from './components/not-found/not-found';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Clients } from './components/clients/clients';
import { HTTP_INTERCEPTORS} from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt-interceptor';
import { Users } from './components/users/users';
import { Projects } from './components/projects/projects';

@NgModule({
  declarations: [
    App,
    Home,
    Navbar,
    Footer,
    Register,
    Login,
    Sidebar,
    Material,
    DashboardLayout,
    AuthLayout,
    NotFound,
    Clients,
    Users,
    Projects,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
