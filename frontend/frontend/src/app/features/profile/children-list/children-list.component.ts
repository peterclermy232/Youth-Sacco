import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Child } from '../../../models/user.model';
import { ProfileService } from '../../../services/profile.service';


@Component({
  selector: 'app-children-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './children-list.component.html',
  styleUrls: ['./children-list.component.scss']
})
export class ChildrenListComponent implements OnInit {
  children: Child[] = [];

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadChildren();
  }

  loadChildren(): void {
    this.profileService.getChildren()
      .subscribe(data => this.children = data);
  }

  deleteChild(id: number): void {
    this.profileService.deleteChild(id)
      .subscribe(() => this.loadChildren());
  }
}
