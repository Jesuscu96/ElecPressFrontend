import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiPreferencesService {
  theme: 'light' | 'dark' = 'light';
  font: 'md' | 'lg' = 'md';

  private THEME_KEY = 'ui_theme';
  private FONT_KEY = 'ui_font';

  constructor() {
    this.loadFromStorage();
    this.applyToDom();
  }

  toggleTheme(): void {
    if (this.theme === 'dark') this.theme = 'light';
    else this.theme = 'dark';

    localStorage.setItem(this.THEME_KEY, this.theme);
    this.applyToDom();
  }

  toggleFontSize(): void {
    if (this.font === 'lg') this.font = 'md';
    else this.font = 'lg';

    localStorage.setItem(this.FONT_KEY, this.font);
    this.applyToDom();
  }

  private loadFromStorage(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      this.theme = savedTheme;
    }

    const savedFont = localStorage.getItem(this.FONT_KEY);
    if (savedFont === 'md' || savedFont === 'lg') {
      this.font = savedFont;
    }
  }

  private applyToDom(): void {
    const root = document.documentElement;

    if (this.theme === 'dark') root.classList.add('theme-dark');
    else root.classList.remove('theme-dark');

    root.classList.remove('font-md');
    root.classList.remove('font-lg');
    if (this.font === 'lg') root.classList.add('font-lg');
    else root.classList.add('font-md');
  }
}
