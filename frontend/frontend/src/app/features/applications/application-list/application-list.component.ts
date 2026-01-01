import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../../models/application.model';


@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.scss'
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  loading = true;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationService.getApplications().subscribe({
      next: apps => {
        this.applications = apps;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase();
  }
}
