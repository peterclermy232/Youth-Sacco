import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() icon = 'analytics';
  @Input() label = 'Stat';
  @Input() value: string | number = '0';
  @Input() change = '';
  @Input() colorClass: 'primary' | 'success' | 'warning' | 'info' = 'primary';

  get changeIcon(): string {
    if (this.change.startsWith('+')) return 'trending_up';
    if (this.change.startsWith('-')) return 'trending_down';
    return 'remove';
  }

  get changeClass(): string {
    if (this.change.startsWith('+')) return 'positive';
    if (this.change.startsWith('-')) return 'negative';
    return '';
  }
}
