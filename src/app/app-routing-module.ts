import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayout } from './components/auth-layout/auth-layout';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { DashboardLayout } from './components/dashboard-layout/dashboard-layout';
import { Home } from './components/home/home';
import { Users } from './components/users/users';
import { Material } from './components/material/material';
import { NotFound } from './components/not-found/not-found';
import { Clients } from './components/clients/clients';
import { AuthGuard } from './guards/auth-guard';


const routes: Routes = [
  {
    path:'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: Login
      },
      {
        path: 'register',
        component: Register
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children:  [
      { 
        path: '', 
        pathMatch: 'full',
        component: Home 
      },
      { 
        path: 'users', 
        component: Users 
      },
      { 
        path: 'material', 
        component: Material 
      },
      { path: 'clients',
        component: Clients 
      }

    ],
  },
  { 
    path: '', 
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  { 
    path: '**', 
    component: NotFound,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
