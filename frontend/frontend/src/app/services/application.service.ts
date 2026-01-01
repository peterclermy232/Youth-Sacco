import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Application,
  ApplicationCreate,
  ApplicationReview
} from '../models/application.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/`);
  }

  getApplication(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}/`);
  }

  createApplication(data: FormData): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/create/`, data);
  }

  getPendingApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/pending/`);
  }

  reviewApplication(id: number, data: ApplicationReview): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/${id}/review/`, data);
  }

  // Helper method to create FormData
  createApplicationFormData(application: ApplicationCreate): FormData {
    const formData = new FormData();

    formData.append('application_type', application.application_type);
    formData.append('reason', application.reason);

    if (application.additional_notes) {
      formData.append('additional_notes', application.additional_notes);
    }
    if (application.supporting_document_1) {
      formData.append('supporting_document_1', application.supporting_document_1);
    }
    if (application.supporting_document_2) {
      formData.append('supporting_document_2', application.supporting_document_2);
    }

    return formData;
  }
}
