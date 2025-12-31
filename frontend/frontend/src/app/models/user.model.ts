
export interface User {
  id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  role: 'ADMIN' | 'MEMBER';
  is_active: boolean;
  date_joined: string;
}

export interface LoginRequest {
  phone_number: string;
  password: string;
}

export interface RegisterRequest {
  phone_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface NextOfKin {
  id?: number;
  full_name: string;
  relationship: string;
  phone_number: string;
  email?: string;
  address?: string;
  id_number?: string;
  created_at?: string;
  updated_at?: string;
}
