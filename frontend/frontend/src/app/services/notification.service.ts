// frontend/src/app/services/notification.service.ts - FIXED
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Notification, NotificationPreferences } from '../models/notification';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUnreadCount();
  }

  private loadUnreadCount(): void {
    this.getUnreadCount().subscribe({
      next: (count) => this.unreadCountSubject.next(count),
      error: (err) => {
        console.error('Failed to load unread count:', err);
        this.unreadCountSubject.next(0);
      }
    });
  }

  getNotifications(params?: { read?: boolean; category?: string }): Observable<Notification[]> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.read !== undefined) {
        httpParams = httpParams.set('read', params.read.toString());
      }
      if (params.category) {
        httpParams = httpParams.set('category', params.category);
      }
    }

    return this.http.get<Notification[]>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      catchError(error => {
        console.error('Error loading notifications:', error);
        throw error;
      })
    );
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count/`).pipe(
      catchError(error => {
        console.error('Error loading unread count:', error);
        throw error;
      })
    );
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.post<Notification>(`${this.apiUrl}/${id}/mark-read/`, {}).pipe(
      tap(() => {
        const current = this.unreadCountSubject.value;
        this.unreadCountSubject.next(Math.max(0, current - 1));
      }),
      catchError(error => {
        console.error('Error marking notification as read:', error);
        throw error;
      })
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/mark-all-read/`, {}).pipe(
      tap(() => this.unreadCountSubject.next(0)),
      catchError(error => {
        console.error('Error marking all as read:', error);
        throw error;
      })
    );
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`).pipe(
      catchError(error => {
        console.error('Error deleting notification:', error);
        throw error;
      })
    );
  }

  getPreferences(): Observable<NotificationPreferences> {
    return this.http.get<NotificationPreferences>(`${this.apiUrl}/preferences/`).pipe(
      catchError(error => {
        console.error('Error loading preferences:', error);
        throw error;
      })
    );
  }

  updatePreferences(preferences: NotificationPreferences): Observable<NotificationPreferences> {
    return this.http.put<NotificationPreferences>(`${this.apiUrl}/preferences/`, preferences).pipe(
      catchError(error => {
        console.error('Error updating preferences:', error);
        throw error;
      })
    );
  }
}
