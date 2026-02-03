import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  MeResponse,
} from '../common/auth-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URI: string = environment.apiBaseUrl; // AJUSTA a tu base

  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.URI}/auth/login`, data);
  }

  register(data: any) {
    return this.http.post<any>(`${this.URI}/auth/register`, data);
  }

  me() {
    return this.http.get<MeResponse>(`${this.URI}/auth/me`);
  }
}
