import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserProfile,
  SpouseDetails,
  Child,
  Beneficiary
} from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // Profile
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile/`);
  }

  updateProfile(data: FormData): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/profile/`, data);
  }

  // Spouse
  getSpouseDetails(): Observable<SpouseDetails> {
    return this.http.get<SpouseDetails>(`${this.apiUrl}/spouse/`);
  }

  updateSpouseDetails(data: FormData): Observable<SpouseDetails> {
    return this.http.put<SpouseDetails>(`${this.apiUrl}/spouse/`, data);
  }

  // Children
  getChildren(): Observable<Child[]> {
    return this.http.get<Child[]>(`${this.apiUrl}/children/`);
  }

  createChild(data: FormData): Observable<Child> {
    return this.http.post<Child>(`${this.apiUrl}/children/`, data);
  }

  updateChild(id: number, data: FormData): Observable<Child> {
    return this.http.put<Child>(`${this.apiUrl}/children/${id}/`, data);
  }

  deleteChild(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/children/${id}/`);
  }

  // Beneficiaries
  getBeneficiaries(): Observable<Beneficiary[]> {
    return this.http.get<Beneficiary[]>(`${this.apiUrl}/beneficiaries/`);
  }

  createBeneficiary(data: FormData): Observable<Beneficiary> {
    return this.http.post<Beneficiary>(`${this.apiUrl}/beneficiaries/`, data);
  }

  updateBeneficiary(id: number, data: FormData): Observable<Beneficiary> {
    return this.http.put<Beneficiary>(`${this.apiUrl}/beneficiaries/${id}/`, data);
  }

  deleteBeneficiary(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/beneficiaries/${id}/`);
  }
}
