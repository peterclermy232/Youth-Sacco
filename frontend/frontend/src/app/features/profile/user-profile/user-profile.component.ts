import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ProfileService } from '../../../services/profile.service';
import { UserProfile, SpouseDetails, Child } from '../../../models/user.model';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../components/shared/status-badge/status-badge.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    LoadingSpinnerComponent,
    StatusBadgeComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  profile = signal<UserProfile | null>(null);
  loading = signal(true);

  // Computed signals for template access
  user = computed(() => this.profile());
  spouse = computed(() => this.profile()?.spouse_details || null);
  children = computed(() => this.profile()?.children || []);

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading.set(false);
      }
    });
  }

  changePhoto(): void {
    // Implement photo change logic
    console.log('Change photo clicked');
  }
}
