import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettings } from '../../../models/settings';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  settings?: UserSettings;

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.settings$
      .subscribe(settings => this.settings = settings || undefined);
  }

  update(data: Partial<UserSettings>): void {
    this.settingsService.updateSettings(data).subscribe();
  }
}
