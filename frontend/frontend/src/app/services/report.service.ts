import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FinancialReport {
  period: string;
  total_contributions: number;
  total_members: number;
  by_type: {
    type: string;
    amount: number;
    count: number;
  }[];
  monthly_data: {
    month: string;
    amount: number;
  }[];
}

export interface CompensatoryReport {
  period: string;
  total_compensations: number;
  by_category: {
    category: string;
    amount: number;
    count: number;
  }[];
}

export interface ActivityLog {
  id: number;
  user: string;
  action: string;
  description: string;
  timestamp: string;
  ip_address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getFinancialReport(params: { start_date?: string; end_date?: string; type?: string }): Observable<FinancialReport> {
    return this.http.get<FinancialReport>(`${this.apiUrl}/financial/`, { params: params as any });
  }

  getCompensatoryReport(params: { start_date?: string; end_date?: string }): Observable<CompensatoryReport> {
    return this.http.get<CompensatoryReport>(`${this.apiUrl}/compensatory/`, { params: params as any });
  }

  getActivityLogs(params?: { user?: number; action?: string; start_date?: string; end_date?: string }): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.apiUrl}/activity-logs/`, { params: params as any });
  }

  exportReport(type: 'financial' | 'compensatory', format: 'pdf' | 'csv' | 'xlsx', params: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export/`, {
      type,
      format,
      ...params
    }, {
      responseType: 'blob'
    });
  }

  downloadReport(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
