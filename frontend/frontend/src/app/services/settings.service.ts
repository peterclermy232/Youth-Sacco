import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserSettings, IntegratedFirm } from '../models/settings';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.apiUrl}/settings`;
  private settingsSubject = new BehaviorSubject<UserSettings | null>(null);
  public settings$ = this.settingsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.getSettings().subscribe({
      next: (settings) => this.settingsSubject.next(settings),
      error: (err) => console.error('Failed to load settings:', err)
    });
  }

  getSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(`${this.apiUrl}/`);
  }

  updateSettings(settings: Partial<UserSettings>): Observable<UserSettings> {
    return this.http.patch<UserSettings>(`${this.apiUrl}/`, settings).pipe(
      tap(updated => this.settingsSubject.next(updated))
    );
  }

  getIntegratedFirms(): Observable<IntegratedFirm[]> {
    return this.http.get<IntegratedFirm[]>(`${environment.apiUrl}/integrated-firms/`);
  }

  getIntegratedFirm(id: number): Observable<IntegratedFirm> {
    return this.http.get<IntegratedFirm>(`${environment.apiUrl}/integrated-firms/${id}/`);
  }
}
