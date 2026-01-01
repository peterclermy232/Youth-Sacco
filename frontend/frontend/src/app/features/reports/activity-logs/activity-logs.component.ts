import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityLog, ReportService } from '../../../services/report.service';


@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.scss']
})
export class ActivityLogsComponent implements OnInit {
  logs: ActivityLog[] = [];
  loading = false;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    this.reportService.getActivityLogs().subscribe({
      next: data => {
        this.logs = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
