import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { trigger, style, transition, animate, stagger, query } from '@angular/animations';
import { ProfileService } from '../../../services/profile.service';
import { Beneficiary } from '../../../models/user.model';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../components/shared/status-badge/status-badge.component';

@Component({
  selector: 'app-beneficiary-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    LoadingSpinnerComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './beneficiary-list.component.html',
  styleUrl: './beneficiary-list.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class BeneficiaryListComponent implements OnInit {
  beneficiaries: Beneficiary[] = [];
  loading = true;

  constructor(
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
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
        this.snackBar.open('Failed to load beneficiaries', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'status-active',
      'PENDING': 'status-pending',
      'INACTIVE': 'status-inactive',
      'active': 'status-active',
      'pending': 'status-pending',
      'deceased': 'status-inactive'
    };
    return statusMap[status] || 'status-pending';
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  navigateToAdd(): void {
    this.router.navigate(['/member/beneficiaries/add']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/member/beneficiaries/edit', id]);
  }

  deleteBeneficiary(id: number, name: string): void {
    if (confirm(`Are you sure you want to delete ${name} as a beneficiary?`)) {
      this.profileService.deleteBeneficiary(id).subscribe({
        next: () => {
          this.snackBar.open('Beneficiary deleted successfully', 'Close', { duration: 3000 });
          this.loadBeneficiaries();
        },
        error: (error) => {
          console.error('Error deleting beneficiary:', error);
          this.snackBar.open('Failed to delete beneficiary', 'Close', { duration: 3000 });
        }
      });
    }
  }

  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
