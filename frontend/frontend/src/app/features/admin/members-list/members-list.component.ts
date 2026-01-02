// frontend/src/app/features/admin/members-list/members-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { User } from '../../../models/user.model';
import { MemberService } from '../../../services/member.service';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../components/shared/empty-state/empty-state.component';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {

  displayedColumns = ['avatar', 'name', 'phone', 'email', 'role', 'joinedDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>([]);

  searchControl = new FormControl('');
  roleFilter = new FormControl('ALL');
  statusFilter = new FormControl('ALL');

  loading = true;
  totalMembers = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private memberService: MemberService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMembers();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(v => this.applyFilter(v || ''));

    this.roleFilter.valueChanges.subscribe(() => this.applyFilters());
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadMembers(): void {
    this.memberService.getAllMembers().subscribe({
      next: members => {
        this.dataSource.data = members;
        this.totalMembers = members.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load members', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  applyFilters(): void {
    this.dataSource.filterPredicate = (m: User) => {
      const roleOk = this.roleFilter.value === 'ALL' || m.role === this.roleFilter.value;
      const statusOk =
        this.statusFilter.value === 'ALL' ||
        (this.statusFilter.value === 'ACTIVE' ? m.is_active : !m.is_active);

      return roleOk && statusOk;
    };
    this.dataSource.filter = Math.random().toString();
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.roleFilter.setValue('ALL');
    this.statusFilter.setValue('ALL');
  }

  getInitials(u: User): string {
    return `${u.first_name[0]}${u.last_name[0]}`.toUpperCase();
  }

  viewMemberDetails(m: User): void {
    console.log('View', m);
  }

  exportMembers(): void {
    this.snackBar.open('Export coming soon', 'Close', { duration: 2000 });
  }

  // ✅ SAFE COUNTERS (used by template)
  get activeMembersCount(): number {
    return this.dataSource.data.filter(m => m.is_active).length;
  }

  get adminMembersCount(): number {
    return this.dataSource.data.filter(m => m.role === 'ADMIN').length;
  }
}
