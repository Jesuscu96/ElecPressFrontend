import { Component } from '@angular/core';
import { UiPreferencesService } from './services/ui-preferences-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected title = 'ElecPressFrontend';
  constructor(private uiPrefs: UiPreferencesService) {}
}
