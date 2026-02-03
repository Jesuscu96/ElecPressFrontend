import { Injectable } from '@angular/core';

type Theme = 'light' | 'dark';
type FontSize = 'md' | 'lg';

@Injectable({
  providedIn: 'root',
})
export class UiPreferencesService {
  private themeKey = 'theme';
  private fontKey = 'fontSize';

  
  setTheme(theme: Theme): void {
    
    document.body.classList.toggle('theme-dark', theme === 'dark');
    
    localStorage.setItem(this.themeKey, theme);
  }

  getTheme(): Theme {
    const stored = localStorage.getItem(this.themeKey);
    return stored === 'dark' ? 'dark' : 'light';
  }

  toggleTheme(): void {
    const next: Theme = this.getTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  
  setFontSize(size: FontSize): void {
    
    document.body.classList.remove('font-md', 'font-lg');
    document.body.classList.add(size === 'lg' ? 'font-lg' : 'font-md');

    
    localStorage.setItem(this.fontKey, size);
  }

  getFontSize(): FontSize {
    const stored = localStorage.getItem(this.fontKey);
    return stored === 'lg' ? 'lg' : 'md';
  }

  toggleFontSize(): void {
    const next: FontSize = this.getFontSize() === 'lg' ? 'md' : 'lg';
    this.setFontSize(next);
  }

 
  applySavedPreferences(): void {
    this.setTheme(this.getTheme());
    this.setFontSize(this.getFontSize());
  }
}
