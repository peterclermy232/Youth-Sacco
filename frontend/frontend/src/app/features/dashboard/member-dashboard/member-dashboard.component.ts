// frontend/src/app/features/dashboard/member-dashboard/member-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../services/auth.service';
import { ContributionService } from '../../../services/contribution.service';
import { User } from '../../../models/user.model';
import { Balance, Contribution } from '../../../models/contribution.model';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressBarModule,
    MatChip

  ],
  templateUrl: './member-dashboard.component.html',
  styleUrls: ['./member-dashboard.component.scss']
})
export class MemberDashboardComponent implements OnInit {
  currentUser: User | null = null;
  balances: Balance[] = [];
  recentContributions: Contribution[] = [];
  loading = true;

  // Stats
  monthlyDeposit = 0;
  totalContributions = 0;
  interestEarned = 0;
  accountStatus = 'Active';
  savingsProgress = 0;

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
      this.calculateStats();
    });
  }

  private loadBalances(): Promise<void> {
    return new Promise((resolve) => {
      this.contributionService.getMemberBalance().subscribe({
        next: (balances) => {
          this.balances = balances;
          resolve();
        },
        error: () => {
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
        error: () => {
          this.recentContributions = [];
          resolve();
        }
      });
    });
  }

  private calculateStats(): void {
    // Calculate total contributions
    this.totalContributions = this.balances.reduce((sum, b) =>
      sum + parseFloat(b.total_balance), 0
    );

    // Calculate this month's contributions
    const thisMonth = new Date().getMonth();
    this.monthlyDeposit = this.recentContributions
      .filter(c => {
        const contribMonth = new Date(c.submitted_at).getMonth();
        return contribMonth === thisMonth && c.status === 'VERIFIED';
      })
      .reduce((sum, c) => sum + parseFloat(c.amount), 0);

    // Mock interest calculation (3% of total)
    this.interestEarned = this.totalContributions * 0.03;

    // Calculate savings progress (towards 100K goal)
    this.savingsProgress = Math.min((this.totalContributions / 100000) * 100, 100);
  }

  logout(): void {
    this.authService.logout();
  }

  quickDeposit(): void {
    this.router.navigate(['/member/contributions/submit']);
  }
}
