import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DocumentService } from '../../../services/document.service';
import { DocumentCategory } from '../../../models/document.model';
import { FileUploadComponent } from '../../../components/shared/file-upload/file-upload.component';


@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    FileUploadComponent
  ],
  templateUrl: './upload-document.component.html',
  styleUrl: './upload-document.component.scss'
})
export class UploadDocumentComponent implements OnInit {
  uploadForm: FormGroup;
  categories: DocumentCategory[] = [];
  selectedFile: File | null = null;
  uploading = false;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      document_number: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.documentService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  onFileSelected(files: File[]): void {
    this.selectedFile = files[0];
  }

  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) {
      return;
    }

    this.uploading = true;
    const formData = new FormData();

    Object.keys(this.uploadForm.value).forEach(key => {
      if (this.uploadForm.value[key]) {
        formData.append(key, this.uploadForm.value[key]);
      }
    });

    formData.append('file', this.selectedFile);

    this.documentService.uploadDocument(formData).subscribe({
      next: () => {
        this.snackBar.open('Document uploaded successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/member/documents']);
      },
      error: (error) => {
        this.uploading = false;
        this.snackBar.open('Upload failed. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/member/documents']);
  }
}
