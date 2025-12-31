import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../services/auth.service';
import { ContributionService } from '../../services/contribution.service';
import { User } from '../../models/user.model';
import { Balance, Contribution } from '../../models/contribution.model';

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
    MatChipsModule
  ],
  templateUrl: './member-dashboard.component.html',
  styleUrls: ['./member-dashboard.component.scss']
})
export class MemberDashboardComponent implements OnInit {
  currentUser: User | null = null;
  balances: Balance[] = [];
  recentContributions: Contribution[] = [];
  displayedColumns: string[] = ['date', 'type', 'amount', 'status'];

  constructor(
    private authService: AuthService,
    private contributionService: ContributionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadBalances();
    this.loadRecentContributions();
  }

  loadBalances(): void {
    this.contributionService.getMemberBalance().subscribe({
      next: (balances) => {
        this.balances = balances;
      },
      error: (error) => {
        console.error('Error loading balances:', error);
      }
    });
  }

  loadRecentContributions(): void {
    this.contributionService.getContributions().subscribe({
      next: (contributions) => {
        this.recentContributions = contributions.slice(0, 5);
      },
      error: (error) => {
        console.error('Error loading contributions:', error);
      }
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
