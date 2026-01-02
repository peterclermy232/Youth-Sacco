import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../../services/document.service';
import { Document } from '../../../models/document.model';
@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.scss'
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  loading = true;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe({
      next: docs => {
        this.documents = docs;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  deleteDocument(id: number): void {
    if (!confirm('Delete this document?')) return;

    this.documentService.deleteDocument(id).subscribe(() => {
      this.documents = this.documents.filter(d => d.id !== id);
    });
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase();
  }

  openDocument(url: string): void {
    window.open(url, '_blank');
  }
}
