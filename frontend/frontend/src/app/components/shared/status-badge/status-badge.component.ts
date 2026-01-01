import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss'
})
export class StatusBadgeComponent {
  @Input() status: string = '';
  @Input() label: string = '';

  get statusClass(): string {
    const status = (this.status || '').toLowerCase();

    const statusMap: { [key: string]: string } = {
      'verified': 'success',
      'approved': 'success',
      'active': 'success',
      'completed': 'success',
      'pending': 'pending',
      'pending verification': 'pending',
      'stage_1': 'pending',
      'stage_2': 'pending',
      'stage_3': 'pending',
      'rejected': 'error',
      'failed': 'error',
      'inactive': 'inactive',
      'expired': 'warning'
    };

    return statusMap[status] || 'info';
  }
}
