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
    private router: Router
  ) {}

  
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  
  get userLabel(): string {
    const raw = localStorage.getItem('user');
    if (!raw) return '';
    try {
      const u = JSON.parse(raw);
      return `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim();
    } catch {
      return '';
    }
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
