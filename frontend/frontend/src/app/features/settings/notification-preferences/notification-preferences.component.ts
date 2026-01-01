import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationPreferences } from '../../../models/notification';
import { NotificationService } from '../../../services/notification.service';


@Component({
  selector: 'app-notification-preferences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-preferences.component.html',
  styleUrls: ['./notification-preferences.component.scss']
})
export class NotificationPreferencesComponent implements OnInit {
  preferences?: NotificationPreferences;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getPreferences()
      .subscribe(data => this.preferences = data);
  }

  save(): void {
    if (!this.preferences) return;
    this.notificationService.updatePreferences(this.preferences).subscribe();
  }
}
