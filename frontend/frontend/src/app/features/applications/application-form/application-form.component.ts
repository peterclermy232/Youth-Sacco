import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApplicationService } from '../../../services/application.service';
import { AuthService } from '../../../services/auth.service';
import { FileUploadComponent } from '../../../components/shared/file-upload/file-upload.component';


@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatSnackBarModule,
    FileUploadComponent
  ],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss'
})
export class ApplicationFormComponent implements OnInit {
  applicationForm: FormGroup;
  currentUser: any;
  file1: File | null = null;
  file2: File | null = null;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.applicationForm = this.fb.group({
      application_type: ['', Validators.required],
      reason: ['', Validators.required],
      additional_notes: ['']
    });
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  onFile1Selected(files: File[]): void {
    this.file1 = files[0];
  }

  onFile2Selected(files: File[]): void {
    this.file2 = files[0];
  }

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      return;
    }

    this.submitting = true;
    const formData = new FormData();

    formData.append('application_type', this.applicationForm.value.application_type);
    formData.append('reason', this.applicationForm.value.reason);

    if (this.applicationForm.value.additional_notes) {
      formData.append('additional_notes', this.applicationForm.value.additional_notes);
    }

    if (this.file1) {
      formData.append('supporting_document_1', this.file1);
    }

    if (this.file2) {
      formData.append('supporting_document_2', this.file2);
    }

    this.applicationService.createApplication(formData).subscribe({
      next: () => {
        this.snackBar.open('Application submitted successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/member/applications']);
      },
      error: (error) => {
        this.submitting = false;
        this.snackBar.open('Failed to submit application', 'Close', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/member/applications']);
  }
}
