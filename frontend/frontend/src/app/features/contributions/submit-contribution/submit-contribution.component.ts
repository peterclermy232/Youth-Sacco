import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContributionService } from '../../../services/contribution.service';
import { ContributionType } from '../../../models/contribution.model';

@Component({
  selector: 'app-submit-contribution',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './submit-contribution.component.html',
  styleUrl: './submit-contribution.component.scss'
})
export class SubmitContributionComponent implements OnInit {
  contributionForm: FormGroup;
  contributionTypes: ContributionType[] = [];
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private contributionService: ContributionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.contributionForm = this.fb.group({
      contribution_type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      mpesa_transaction_code: ['', [Validators.required, Validators.minLength(10)]],
      mpesa_phone_number: ['', [Validators.required, Validators.pattern(/^\+?1?\d{9,15}$/)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadContributionTypes();
  }

  loadContributionTypes(): void {
    this.contributionService.getContributionTypes().subscribe({
      next: (types) => {
        this.contributionTypes = types;
      },
      error: (error) => {
        this.snackBar.open('Failed to load contribution types', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.contributionForm.invalid) {
      return;
    }

    this.submitting = true;
    this.contributionService.createContribution(this.contributionForm.value).subscribe({
      next: () => {
        this.snackBar.open('Contribution submitted successfully! Awaiting admin verification.', 'Close', { duration: 5000 });
        this.router.navigate(['/member/dashboard']);
      },
      error: (error) => {
        this.submitting = false;
        const errorMessage = error.error?.mpesa_transaction_code?.[0] || 'Failed to submit contribution';
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/member/dashboard']);
  }
}
