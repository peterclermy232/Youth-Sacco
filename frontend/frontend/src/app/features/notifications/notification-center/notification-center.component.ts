// src/app/features/notifications/notification-center.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../models/notification';
@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss']
})
export class NotificationCenterComponent implements OnInit {
  notifications: Notification[] = [];
  activeCategory: string = 'ALL';
  loading = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;

    this.notificationService.getNotifications()
      .subscribe({
        next: data => {
          this.notifications = data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  filter(category: string): void {
    this.activeCategory = category;

    if (category === 'ALL') {
      this.loadNotifications();
      return;
    }

    this.notificationService
      .getNotifications({ category })
      .subscribe(data => this.notifications = data);
  }

  markAsRead(notification: Notification): void {
    if (notification.is_read) return;

    this.notificationService.markAsRead(notification.id)
      .subscribe(() => notification.is_read = true);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead()
      .subscribe(() => {
        this.notifications.forEach(n => n.is_read = true);
      });
  }

  delete(notification: Notification): void {
    this.notificationService.deleteNotification(notification.id)
      .subscribe(() => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      });
  }

  get filteredNotifications(): Notification[] {
    if (this.activeCategory === 'ALL') return this.notifications;
    return this.notifications.filter(n => n.category === this.activeCategory);
  }
}
