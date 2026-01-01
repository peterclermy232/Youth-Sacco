import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @Input() label = 'Click to upload file';
  @Input() hint = '';
  @Input() helpText = '';
  @Input() acceptedTypes = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
  @Input() maxSize = 10485760; // 10MB
  @Input() multiple = false;
  @Input() uploading = false;

  @Output() fileSelected = new EventEmitter<File[]>();

  selectedFiles: File[] = [];
  errorMessage = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.errorMessage = '';
      const files = Array.from(input.files);

      // Validate file size
      const invalidFiles = files.filter(file => file.size > this.maxSize);
      if (invalidFiles.length > 0) {
        this.errorMessage = `File size exceeds ${this.formatFileSize(this.maxSize)} limit`;
        return;
      }

      // Validate file type
      const acceptedExtensions = this.acceptedTypes.split(',').map(ext => ext.trim());
      const invalidTypes = files.filter(file => {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        return !acceptedExtensions.includes(extension);
      });

      if (invalidTypes.length > 0) {
        this.errorMessage = 'Invalid file type. Allowed types: ' + this.acceptedTypes;
        return;
      }

      if (this.multiple) {
        this.selectedFiles = [...this.selectedFiles, ...files];
      } else {
        this.selectedFiles = [files[0]];
      }

      this.fileSelected.emit(this.selectedFiles);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.fileSelected.emit(this.selectedFiles);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
