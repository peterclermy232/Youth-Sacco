import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DocumentCategory,
  Document,
  DocumentUpload,
  DocumentVerification,
  GroupedDocuments
} from '../models/document.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  // Categories
  getCategories(): Observable<DocumentCategory[]> {
    return this.http.get<DocumentCategory[]>(`${this.apiUrl}/categories/`);
  }

  // Documents
  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/`);
  }

  getDocument(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}/`);
  }

  uploadDocument(data: FormData): Observable<Document> {
    return this.http.post<Document>(`${this.apiUrl}/`, data);
  }

  updateDocument(id: number, data: FormData): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}/`, data);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  verifyDocument(id: number, data: DocumentVerification): Observable<Document> {
    return this.http.post<Document>(`${this.apiUrl}/${id}/verify/`, data);
  }

  getGroupedDocuments(): Observable<GroupedDocuments> {
    return this.http.get<GroupedDocuments>(`${this.apiUrl}/my-documents/`);
  }

  // Helper method to create FormData
  createDocumentFormData(document: Partial<DocumentUpload>): FormData {
    const formData = new FormData();

    if (document.category) {
      formData.append('category', document.category.toString());
    }
    if (document.title) {
      formData.append('title', document.title);
    }
    if (document.description) {
      formData.append('description', document.description);
    }
    if (document.file) {
      formData.append('file', document.file);
    }
    if (document.document_number) {
      formData.append('document_number', document.document_number);
    }
    if (document.issue_date) {
      formData.append('issue_date', document.issue_date);
    }
    if (document.expiry_date) {
      formData.append('expiry_date', document.expiry_date);
    }

    return formData;
  }
}
