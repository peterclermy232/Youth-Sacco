import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../models/user.model';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profile?: UserProfile;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile()
      .subscribe(data => this.profile = data);
  }

  save(formData: FormData): void {
    this.profileService.updateProfile(formData).subscribe();
  }
}
