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
import { AuthService } from '../../services/auth.service';
import { ContributionService } from '../../services/contribution.service';
import { DashboardStats, Contribution } from '../../models/contribution.model';

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

  constructor(
    private authService: AuthService,
    private contributionService: ContributionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadPendingContributions();
  }

  loadDashboardStats(): void {
    this.contributionService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  loadPendingContributions(): void {
    this.contributionService.getPendingContributions().subscribe({
      next: (contributions) => {
        this.pendingContributions = contributions;
      },
      error: (error) => {
        console.error('Error loading pending contributions:', error);
      }
    });
  }

  verifyContribution(id: number): void {
    this.router.navigate(['/admin/verify', id]);
  }

  logout(): void {
    this.authService.logout();
  }
}
