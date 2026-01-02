// frontend/src/app/features/admin/members-list/members-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTooltipModule,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {
  displayedColumns: string[] = ['avatar', 'name', 'phone', 'email', 'role', 'joinedDate', 'status', 'actions'];
  dataSource: MatTableDataSource<User>;
  searchControl = new FormControl('');
  roleFilter = new FormControl('ALL');
  statusFilter = new FormControl('ALL');
  loading = true;
  totalMembers = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private memberService: MemberService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit(): void {
    this.loadMembers();
    this.setupSearch();
    this.setupFilters();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.applyFilter(value || '');
      });
  }

  setupFilters(): void {
    this.roleFilter.valueChanges.subscribe(() => this.applyFilters());
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  loadMembers(): void {
    this.loading = true;
    this.memberService.getAllMembers().subscribe({
      next: (members) => {
        this.dataSource.data = members;
        this.totalMembers = members.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.loading = false;
        this.snackBar.open('Failed to load members', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilters(): void {
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const roleMatch = this.roleFilter.value === 'ALL' || data.role === this.roleFilter.value;
      const statusMatch = this.statusFilter.value === 'ALL' ||
        (this.statusFilter.value === 'ACTIVE' ? data.is_active : !data.is_active);

      const searchTerm = this.searchControl.value?.toLowerCase() || '';
      const textMatch = !searchTerm ||
        data.first_name.toLowerCase().includes(searchTerm) ||
        data.last_name.toLowerCase().includes(searchTerm) ||
        data.phone_number.toLowerCase().includes(searchTerm) ||
        (data.email?.toLowerCase().includes(searchTerm) || false);

      return roleMatch && statusMatch && textMatch;
    };

    this.dataSource.filter = Math.random().toString();
  }

  getInitials(user: User): string {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }

  viewMemberDetails(member: User): void {
    this.memberService.setSelectedMember(member);
    // Navigate to member details or open dialog
  }

  editMember(member: User): void {
    // Open edit dialog
    this.snackBar.open('Edit functionality coming soon', 'Close', { duration: 2000 });
  }

  deactivateMember(member: User): void {
    if (confirm(`Are you sure you want to deactivate ${member.first_name} ${member.last_name}?`)) {
      this.memberService.deactivateMember(member.id).subscribe({
        next: () => {
          this.snackBar.open('Member deactivated successfully', 'Close', { duration: 3000 });
          this.loadMembers();
        },
        error: (error) => {
          console.error('Error deactivating member:', error);
          this.snackBar.open('Failed to deactivate member', 'Close', { duration: 3000 });
        }
      });
    }
  }

  exportMembers(): void {
    this.memberService.exportMembers().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `members_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Members exported successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error exporting members:', error);
        this.snackBar.open('Failed to export members', 'Close', { duration: 3000 });
      }
    });
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.roleFilter.setValue('ALL');
    this.statusFilter.setValue('ALL');
  }
}
