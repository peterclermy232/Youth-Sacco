// frontend/src/app/features/dashboard/admin-dashboard/admin-dashboard.component.ts - FIXED
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../services/auth.service';
import { ContributionService } from '../../../services/contribution.service';
import { DashboardStats, Contribution } from '../../../models/contribution.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  pendingContributions: Contribution[] = [];
  displayedColumns: string[] = ['member', 'type', 'amount', 'transaction', 'date', 'actions'];
  loading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private contributionService: ContributionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;
    Promise.all([
      this.loadDashboardStats(),
      this.loadPendingContributions()
    ]).finally(() => {
      this.loading = false;
    });
  }

  private loadDashboardStats(): Promise<void> {
    return new Promise((resolve) => {
      this.contributionService.getDashboardStats().subscribe({
        next: (stats) => {
          this.stats = stats;
          resolve();
        },
        error: (error) => {
          console.error('Error loading stats:', error);
          this.error = 'Failed to load dashboard statistics';
          resolve();
        }
      });
    });
  }

  private loadPendingContributions(): Promise<void> {
    return new Promise((resolve) => {
      this.contributionService.getPendingContributions().subscribe({
        next: (contributions) => {
          this.pendingContributions = contributions;
          resolve();
        },
        error: (error) => {
          console.error('Error loading pending contributions:', error);
          resolve();
        }
      });
    });
  }

  verifyContribution(id: number): void {
    this.router.navigate(['/admin/contributions', id, 'verify']);
  }

  logout(): void {
    this.authService.logout();
  }
}
