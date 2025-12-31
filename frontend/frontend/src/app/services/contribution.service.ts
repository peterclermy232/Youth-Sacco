
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ContributionType,
  Contribution,
  ContributionCreate,
  ContributionVerification,
  Balance,
  DashboardStats
} from '../models/contribution.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ContributionService {
  private apiUrl = `${environment.apiUrl}/contributions`;

  constructor(private http: HttpClient) {}

  // Contribution Types
  getContributionTypes(): Observable<ContributionType[]> {
    return this.http.get<ContributionType[]>(`${this.apiUrl}/types/`);
  }

  // Contributions
  getContributions(): Observable<Contribution[]> {
    return this.http.get<Contribution[]>(`${this.apiUrl}/`);
  }

  getContribution(id: number): Observable<Contribution> {
    return this.http.get<Contribution>(`${this.apiUrl}/${id}/`);
  }

  createContribution(data: ContributionCreate): Observable<Contribution> {
    return this.http.post<Contribution>(`${this.apiUrl}/create/`, data);
  }

  // Admin - Pending Contributions
  getPendingContributions(): Observable<Contribution[]> {
    return this.http.get<Contribution[]>(`${this.apiUrl}/pending/`);
  }

  // Admin - Verify Contribution
  verifyContribution(id: number, data: ContributionVerification): Observable<Contribution> {
    return this.http.post<Contribution>(`${this.apiUrl}/${id}/verify/`, data);
  }

  // Balances
  getMemberBalance(): Observable<Balance[]> {
    return this.http.get<Balance[]>(`${this.apiUrl}/balance/`);
  }

  // Admin - Dashboard Stats
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/`);
  }
}
