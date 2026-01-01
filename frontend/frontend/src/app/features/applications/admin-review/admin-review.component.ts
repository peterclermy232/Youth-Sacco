import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../../models/application.model';

@Component({
  selector: 'app-admin-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-review.component.html',
  styleUrl: './admin-review.component.scss'
})
export class AdminReviewComponent implements OnInit {
  pendingApplications: Application[] = [];
  selected?: Application;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadPending();
  }

  loadPending(): void {
    this.applicationService.getPendingApplications().subscribe(apps => {
      this.pendingApplications = apps;
    });
  }

  select(app: Application): void {
    this.selected = app;
  }

  review(decision: 'APPROVE' | 'REJECT'): void {
  if (!this.selected) return;

  this.applicationService
    .reviewApplication(this.selected.id, {
      decision,    
      comments: ''
    })
    .subscribe(() => {
      this.selected = undefined;
      this.loadPending();
    });
}

}
