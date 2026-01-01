import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpouseDetails } from '../../../models/user.model';
import { ProfileService } from '../../../services/profile.service';


@Component({
  selector: 'app-spouse-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spouse-details.component.html',
  styleUrls: ['./spouse-details.component.scss']
})
export class SpouseDetailsComponent implements OnInit {
  spouse?: SpouseDetails;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getSpouseDetails()
      .subscribe(data => this.spouse = data);
  }
}
