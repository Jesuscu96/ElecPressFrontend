import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UiPreferencesService } from '../../services/ui-preferences-service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Output() sidebarToggle = new EventEmitter<void>();

  constructor(
    public uiPrefs: UiPreferencesService,
    private router: Router,
  ) {}

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private get storedUser(): any | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  get userLabel(): string {
  const u = this.storedUser;
  if (!u) return '';

  const first = u.first_name ? u.first_name : '';
  const last = u.last_name ? u.last_name : '';
  return (first + ' ' + last).trim();
}

get roleLabel(): string {
  const u = this.storedUser;
  if (!u) return '';
  return u.role ? u.role : '';
}


  onToggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  toggleTheme(): void {
    this.uiPrefs.toggleTheme();
  }

  toggleFont(): void {
    this.uiPrefs.toggleFontSize();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }
}
