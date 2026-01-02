// frontend/src/app/features/admin/member-details/member-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../../models/user.model';
import { Contribution } from '../../../models/contribution.model';
import { ContributionService } from '../../../services/contribution.service';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../components/shared/status-badge/status-badge.component';
import { MemberService } from '../../../services/member.service';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    MatTableModule,
    MatSnackBarModule,
    LoadingSpinnerComponent,
    StatusBadgeComponent
  ],
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {
  member: User | null = null;
  contributions: Contribution[] = [];
  loading = true;
  contributionColumns = ['date', 'type', 'amount', 'status'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MemberService,
    private contributionService: ContributionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const memberId = Number(this.route.snapshot.paramMap.get('id'));
    if (memberId) {
      this.loadMemberDetails(memberId);
    } else {
      this.router.navigate(['/admin/members']);
    }
  }

  loadMemberDetails(id: number): void {
    this.loading = true;
    Promise.all([
      this.loadMember(id),
      this.loadMemberContributions(id)
    ]).finally(() => {
      this.loading = false;
    });
  }

  private loadMember(id: number): Promise<void> {
    return new Promise((resolve) => {
      this.memberService.getMember(id).subscribe({
        next: (member) => {
          this.member = member;
          resolve();
        },
        error: (error) => {
          console.error('Error loading member:', error);
          this.snackBar.open('Failed to load member details', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/members']);
          resolve();
        }
      });
    });
  }

  private loadMemberContributions(id: number): Promise<void> {
    return new Promise((resolve) => {
      // This would need to be filtered by member ID on the backend
      this.contributionService.getContributions().subscribe({
        next: (contributions) => {
          this.contributions = contributions.filter(c => c.member === id).slice(0, 10);
          resolve();
        },
        error: (error) => {
          console.error('Error loading contributions:', error);
          this.contributions = [];
          resolve();
        }
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/members']);
  }

  editMember(): void {
    this.snackBar.open('Edit functionality coming soon', 'Close', { duration: 2000 });
  }

  deactivateMember(): void {
    if (!this.member) return;

    if (confirm(`Are you sure you want to deactivate ${this.member.first_name} ${this.member.last_name}?`)) {
      this.memberService.deactivateMember(this.member.id).subscribe({
        next: () => {
          this.snackBar.open('Member deactivated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/members']);
        },
        error: (error) => {
          console.error('Error deactivating member:', error);
          this.snackBar.open('Failed to deactivate member', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getTotalContributions(): number {
    return this.contributions
      .filter(c => c.status === 'VERIFIED')
      .reduce((sum, c) => sum + parseFloat(c.amount), 0);
  }
}
