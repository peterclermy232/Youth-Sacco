import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialReport, ReportService } from '../../../services/report.service';


@Component({
  selector: 'app-financial-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financial-reports.component.html',
  styleUrls: ['./financial-reports.component.scss']
})
export class FinancialReportsComponent {
  report?: FinancialReport;
  loading = false;

  constructor(private reportService: ReportService) {}

  loadReport(): void {
    this.loading = true;
    this.reportService.getFinancialReport({}).subscribe({
      next: data => {
        this.report = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  export(format: 'pdf' | 'csv' | 'xlsx'): void {
    this.reportService.exportReport('financial', format, {})
      .subscribe(blob =>
        this.reportService.downloadReport(blob, `financial-report.${format}`)
      );
  }
}
