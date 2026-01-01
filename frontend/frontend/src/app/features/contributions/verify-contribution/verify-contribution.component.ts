import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Contribution } from '../../../models/contribution.model';
import { ContributionService } from '../../../services/contribution.service';



@Component({
  selector: 'app-verify-contribution',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './verify-contribution.component.html',
  styleUrl: './verify-contribution.component.scss'
})
export class VerifyContributionComponent {
 contribution: Contribution | null = null;
  verificationForm: FormGroup;
  loading = false;
  submitting = false;
  contributionId: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contributionService: ContributionService,
    private snackBar: MatSnackBar
  ) {
    this.verificationForm = this.fb.group({
      status: ['VERIFIED', Validators.required],
      rejection_reason: ['']
    });

    // Watch status changes to conditionally require rejection_reason
    this.verificationForm.get('status')?.valueChanges.subscribe(status => {
      const rejectionControl = this.verificationForm.get('rejection_reason');
      if (status === 'REJECTED') {
        rejectionControl?.setValidators([Validators.required]);
      } else {
        rejectionControl?.clearValidators();
      }
      rejectionControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.contributionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadContribution();
  }

  loadContribution(): void {
    this.loading = true;
    this.contributionService.getContribution(this.contributionId).subscribe({
      next: (contribution) => {
        this.contribution = contribution;
        this.loading = false;

        if (contribution.status !== 'PENDING') {
          this.snackBar.open('This contribution has already been processed', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/admin']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Failed to load contribution', 'Close', { duration: 3000 });
        this.router.navigate(['/admin']);
      }
    });
  }

  onSubmit(): void {
    if (this.verificationForm.invalid) {
      return;
    }

    this.submitting = true;
    this.contributionService.verifyContribution(
      this.contributionId,
      this.verificationForm.value
    ).subscribe({
      next: (result) => {
        const action = this.verificationForm.value.status === 'VERIFIED' ? 'verified' : 'rejected';
        this.snackBar.open(`Contribution ${action} successfully!`, 'Close', {
          duration: 3000
        });
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.submitting = false;
        this.snackBar.open('Failed to process contribution', 'Close', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin']);
  }
}

