// frontend/src/app/features/dashboard/member-dashboard/member-dashboard.component.ts - FIXED
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../services/auth.service';
import { ContributionService } from '../../../services/contribution.service';
import { User } from '../../../models/user.model';
import { Balance, Contribution } from '../../../models/contribution.model';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatDividerModule,
    MatMenuModule
  ],
  templateUrl: './member-dashboard.component.html',
  styleUrls: ['./member-dashboard.component.scss']
})
export class MemberDashboardComponent implements OnInit {
  currentUser: User | null = null;
  balances: Balance[] = [];
  recentContributions: Contribution[] = [];
  displayedColumns: string[] = ['date', 'type', 'amount', 'status'];
  loading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private contributionService: ContributionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe({
      next: (user) => {
        this.currentUser = user;
        if (user) {
          this.loadDashboardData();
        }
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.error = 'Failed to load user information';
        this.loading = false;
      }
    });
  }

  private loadDashboardData(): void {
    this.loading = true;
    Promise.all([
      this.loadBalances(),
      this.loadRecentContributions()
    ]).finally(() => {
      this.loading = false;
    });
  }

  private loadBalances(): Promise<void> {
    return new Promise((resolve) => {
      this.contributionService.getMemberBalance().subscribe({
        next: (balances) => {
          this.balances = balances;
          resolve();
        },
        error: (error) => {
          console.error('Error loading balances:', error);
          this.balances = [];
          resolve();
        }
      });
    });
  }

  private loadRecentContributions(): Promise<void> {
    return new Promise((resolve) => {
      this.contributionService.getContributions().subscribe({
        next: (contributions) => {
          this.recentContributions = contributions.slice(0, 5);
          resolve();
        },
        error: (error) => {
          console.error('Error loading contributions:', error);
          this.recentContributions = [];
          resolve();
        }
      });
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'VERIFIED': return 'primary';
      case 'PENDING': return 'accent';
      case 'REJECTED': return 'warn';
      default: return '';
    }
  }
}
