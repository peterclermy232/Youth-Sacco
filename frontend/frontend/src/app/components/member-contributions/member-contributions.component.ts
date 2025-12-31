import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContributionService } from '../../services/contribution.service';
import { Contribution } from '../../models/contribution.model';

@Component({
  selector: 'app-member-contributions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './member-contributions.component.html',
  styleUrls: ['./member-contributions.component.scss']
})
export class MemberContributionsComponent implements OnInit {
  contributions: Contribution[] = [];
  loading = false;
  displayedColumns: string[] = ['date', 'type', 'amount', 'transaction', 'status', 'verified'];

  constructor(private contributionService: ContributionService) {}

  ngOnInit(): void {
    this.loadContributions();
  }

  loadContributions(): void {
    this.loading = true;
    this.contributionService.getContributions().subscribe({
      next: (contributions) => {
        this.contributions = contributions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading contributions:', error);
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' | undefined {
    switch (status) {
      case 'VERIFIED': return 'primary';
      case 'PENDING': return 'accent';
      case 'REJECTED': return 'warn';
      default: return undefined;
    }
  }

  // Add getter methods for the summary counts
  get verifiedCount(): number {
    return this.contributions.filter(c => c.status === 'VERIFIED').length;
  }

  get pendingCount(): number {
    return this.contributions.filter(c => c.status === 'PENDING').length;
  }

  get totalCount(): number {
    return this.contributions.length;
  }
}
