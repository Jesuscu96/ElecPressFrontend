import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { LoginResponse } from '../../common/auth-interface';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  errorMsg: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  submit() {
    this.errorMsg = '';
    this.loading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: LoginResponse) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/dashboard/clients']);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Error al iniciar sesión';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }


}
