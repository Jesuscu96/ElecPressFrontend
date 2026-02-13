import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}
  validateForm(): boolean  {
    this.errorMsg = "";
    if(!this.email.trim()) {
      this.errorMsg = "El email es obligatorio "
      return false;
    }
    if(this.password.trim().length < 8) {
      this.errorMsg += "la contraseña es obligatoria escribela bien "
      return false;
    }
    this.submit()
    return true;

  }

  submit() {
    
    this.errorMsg = '';
    this.loading = true;

    this.authService.login({ email: this.email.trim(), password: this.password.trim() }).subscribe({
      next: (value: LoginResponse) => {
        localStorage.setItem('token', value.token);
        localStorage.setItem('user', JSON.stringify(value.user));
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
        this.router.navigateByUrl(returnUrl);
        this.loading = false;

      },
      error: (err) => {
        this.errorMsg =  'Error al iniciar sesión';
        console.error(err);
        
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }


}
