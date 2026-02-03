import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { RegisterRequest } from '../../common/auth-interface';
@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  phoneInput = '';

  form = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    birth_date: '',
    phone: "",
  };

  confirmPassword = '';
  loading = false;
  errorMsg = '';
  okMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.errorMsg = '';
    this.okMsg = '';

    const f = this.form;

    if (!f.first_name.trim() || !f.last_name.trim()) {
      this.errorMsg = 'Nombre y apellidos son obligatorios.';
      return;
    }
    if (!f.email.trim() || !f.password) {
      this.errorMsg = 'Email y contraseña son obligatorios.';
      return;
    }
    const strongPass = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!strongPass.test(f.password)) {
      this.errorMsg =
        'La contraseña debe tener mínimo 8 caracteres e incluir una letra, un número y un símbolo.';
      return;
    }

    if (f.password !== this.confirmPassword) {
      this.errorMsg = 'Las contraseñas no coinciden.';
      return;
    }
    if (!f.birth_date) {
      this.errorMsg = 'La fecha de nacimiento es obligatoria.';
      return;
    }

    

    if (!f.phone.trim()) {
      this.errorMsg = 'El teléfono es obligatorio.';
      return;
    }

    if (!/^\d{8,15}$/.test(f.phone.trim())) {
      this.errorMsg = 'El teléfono debe tener entre 8 y 15 dígitos (solo números).';
      return;
    }

    const payload: RegisterRequest = {
      first_name: f.first_name.trim(),
      last_name: f.last_name.trim(),
      email: f.email.trim(),
      password: f.password,
      birth_date: f.birth_date,
      phone: f.phone,
    };

    this.loading = true;
    this.auth.register(payload).subscribe({
      next: (res) => {
        this.okMsg = res?.message || 'Registro correcto. Ahora inicia sesión.';
        setTimeout(() => this.router.navigate(['/auth/login']), 500);
      },
      error: (err) => {
        this.errorMsg =
          err?.error?.message ||
          'No se pudo registrar. Revisa datos o si el email ya existe.';
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
