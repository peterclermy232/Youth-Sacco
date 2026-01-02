import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private selectedMemberSubject = new BehaviorSubject<User | null>(null);
  public selectedMember$ = this.selectedMemberSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all members (Admin only)
  getAllMembers(params?: { role?: string; status?: string }): Observable<User[]> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.role) {
        httpParams = httpParams.set('role', params.role);
      }
      if (params.status) {
        httpParams = httpParams.set('status', params.status);
      }
    }

    return this.http.get<User[]>(`${this.apiUrl}/users/`, { params: httpParams }).pipe(
      catchError(error => {
        console.error('Error loading members:', error);
        throw error;
      })
    );
  }

  // Get member by ID
  getMember(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}/`).pipe(
      catchError(error => {
        console.error('Error loading member:', error);
        throw error;
      })
    );
  }

  // Update member
  updateMember(id: number, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}/`, data).pipe(
      catchError(error => {
        console.error('Error updating member:', error);
        throw error;
      })
    );
  }

  // Deactivate member
  deactivateMember(id: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}/`, { is_active: false }).pipe(
      catchError(error => {
        console.error('Error deactivating member:', error);
        throw error;
      })
    );
  }

  // Activate member
  activateMember(id: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}/`, { is_active: true }).pipe(
      catchError(error => {
        console.error('Error activating member:', error);
        throw error;
      })
    );
  }

  // Export members to CSV
  exportMembers(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/users/export/`, {
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Error exporting members:', error);
        throw error;
      })
    );
  }

  // Set selected member for detail view
  setSelectedMember(member: User): void {
    this.selectedMemberSubject.next(member);
  }

  // Get selected member
  getSelectedMember(): User | null {
    return this.selectedMemberSubject.value;
  }

  // Clear selected member
  clearSelectedMember(): void {
    this.selectedMemberSubject.next(null);
  }

  // Get member statistics
  getMemberStats(): Observable<{
    total: number;
    active: number;
    inactive: number;
    admins: number;
    new_this_month: number;
  }> {
    return this.http.get<any>(`${this.apiUrl}/users/stats/`).pipe(
      catchError(error => {
        console.error('Error loading member stats:', error);
        throw error;
      })
    );
  }
}
