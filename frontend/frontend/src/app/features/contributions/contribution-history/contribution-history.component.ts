import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributionService } from '../../../services/contribution.service';
import { Contribution } from '../../../models/contribution.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contribution-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contribution-history.component.html',
  styleUrl: './contribution-history.component.scss'
})
export class ContributionHistoryComponent implements OnInit {
  contributions: Contribution[] = [];
  loading = true;
  filterMonth: string = '';

  constructor(private contributionService: ContributionService) {}

  ngOnInit(): void {
    this.loadContributions();
  }

  loadContributions(): void {
    this.loading = true;
    this.contributionService.getContributions().subscribe({
      next: (data: Contribution[]) => {
        // If filterMonth is set, filter locally
        if (this.filterMonth) {
          this.contributions = data.filter(c =>
            c.submitted_at.startsWith(this.filterMonth)
          );
        } else {
          this.contributions = data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load contributions:', err);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'VERIFIED': return 'verified';
      case 'PENDING': return 'pending';
      case 'REJECTED': return 'rejected';
      default: return '';
    }
  }

  onFilterChange(month: string): void {
    this.filterMonth = month;
    this.loadContributions();
  }
}
