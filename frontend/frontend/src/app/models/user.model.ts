export interface User {
  id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  role: 'ADMIN' | 'MEMBER';
  is_active: boolean;
  date_joined: string;

  // Extended fields
  age?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  marital_status?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  number_of_kids?: number;
  profession?: string;
  salary_range?: string;
  passport_photo?: string;
  identity_document?: string;
}

export interface SpouseDetails {
  id?: number;
  full_name: string;
  age: number;
  phone_number: string;
  email?: string;
  profession?: string;
  id_number: string;
  identity_document?: string;
  created_at?: string;
  updated_at?: string;
  phone: string;
}

export interface Child {
  id?: number;
  full_name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  birth_certificate: string | File;
  created_at?: string;
  updated_at?: string;

}

export interface Beneficiary {
  id?: number;
  full_name: string;
  age: number;
  relationship: string;
  phone_number: string;
  email?: string;
  profession?: string;
  salary_range?: string;
  identity_document: string | File;
  birth_certificate: string | File;
  additional_document?: string | File;
  status: 'ACTIVE' | 'DECEASED' | 'REPLACED';
  status_display?: string;
  death_certificate?: string | File;
  death_certificate_number?: string;
  date_of_death?: string;
  percentage_share: number;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
  date_of_birth?: string;
  occupation?: string;
}

export interface UserProfile {
  id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  role: 'ADMIN' | 'MEMBER';
  date_joined: string;
  age?: number;
  gender?: string;
  marital_status?: string;
  number_of_kids?: number;
  profession?: string;
  salary_range?: string;
  passport_photo?: string;
  identity_document?: string;
  spouse_details?: SpouseDetails;
  children?: Child[];
  beneficiaries?: Beneficiary[];
  next_of_kin?: NextOfKin;
  full_name: string;
  designation: string;
  status: string;
  phone: string;
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
  age?: number;
  gender?: string;
  marital_status?: string;
  profession?: string;
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
