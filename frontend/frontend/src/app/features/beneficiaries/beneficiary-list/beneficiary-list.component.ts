import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileService } from '../../../services/profile.service';
import { Beneficiary } from '../../../models/user.model';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../components/shared/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../components/shared/empty-state/empty-state.component';

@Component({
  selector: 'app-beneficiary-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    LoadingSpinnerComponent,
    StatusBadgeComponent,
    EmptyStateComponent
  ],
  templateUrl: './beneficiary-list.component.html',
  styleUrl: './beneficiary-list.component.scss'
})
export class BeneficiaryListComponent implements OnInit {
  beneficiaries: Beneficiary[] = [];
  loading = true;
  displayedColumns = ['name', 'relationship', 'contact', 'share', 'status', 'actions'];

  constructor(
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBeneficiaries();
  }

  loadBeneficiaries(): void {
    this.loading = true;
    this.profileService.getBeneficiaries().subscribe({
      next: (beneficiaries) => {
        this.beneficiaries = beneficiaries;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading beneficiaries:', error);
        this.loading = false;
      }
    });
  }

  get totalShare(): number {
    return this.beneficiaries
      .filter(b => b.status === 'ACTIVE')
      .reduce((sum, b) => sum + Number(b.percentage_share), 0);
  }

  deleteBeneficiary(id: number): void {
    if (confirm('Are you sure you want to delete this beneficiary?')) {
      this.profileService.deleteBeneficiary(id).subscribe({
        next: () => {
          this.snackBar.open('Beneficiary deleted successfully', 'Close', { duration: 3000 });
          this.loadBeneficiaries();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete beneficiary', 'Close', { duration: 3000 });
        }
      });
    }
  }

  navigateToAdd(): void {
    // Router navigation handled by routerLink
  }
}
