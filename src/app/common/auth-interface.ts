export type UserRole = 'superAdmin' | 'admin' | 'user' | 'inactive';
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  role: UserRole;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  birth_date: string | null;
  created_at?: string;
  image?: string | null;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface MeResponse {
  user: AuthUser;
}
export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string ;
  birth_date: string ;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}
