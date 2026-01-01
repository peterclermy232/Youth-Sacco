// frontend/src/app/core/layout/sidebar/sidebar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs/internal/Observable';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: string | number | null;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  label: string;
  route: string;
  badge?: string | number | null;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatTooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Input() isMobile = false;
  @Output() toggleSidebar = new EventEmitter<void>();


  isAdmin = false;
  expandedMenus: Set<string> = new Set();

  memberMenuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/member/dashboard'
    },
    {
      label: 'My Profile',
      icon: 'person',
      route: '/member/profile'
    },
    {
      label: 'Beneficiaries',
      icon: 'group',
      route: '/member/beneficiaries'
    },
    {
      label: 'Contributions',
      icon: 'account_balance_wallet',
      route: '/member/contributions',
      submenu: [
        { label: 'Submit New', route: '/member/contributions/submit' },
        { label: 'History', route: '/member/contributions/history' }
      ]
    },
    {
      label: 'Documents',
      icon: 'folder',
      route: '/member/documents'
    },
    {
      label: 'Applications',
      icon: 'assignment',
      route: '/member/applications',
      badge: '2'
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/member/settings'
    }
  ];

  adminMenuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard'
    },
    {
      label: 'Members',
      icon: 'group',
      route: '/admin/members',
      badge: '127'
    },
    {
      label: 'Contributions',
      icon: 'account_balance_wallet',
      route: '/admin/contributions',
      submenu: [
        { label: 'Pending Verification', route: '/admin/contributions/pending', badge: '5' },
        { label: 'All Contributions', route: '/admin/contributions/all' },
        { label: 'Reports', route: '/admin/contributions/reports' }
      ]
    },
    {
      label: 'Documents',
      icon: 'folder',
      route: '/admin/documents',
      badge: '3'
    },
    {
      label: 'Applications',
      icon: 'assignment',
      route: '/admin/applications',
      badge: '2'
    },
    {
      label: 'Reports',
      icon: 'assessment',
      route: '/admin/reports',
      submenu: [
        { label: 'Financial Reports', route: '/admin/reports/financial' },
        { label: 'Compensatory Reports', route: '/admin/reports/compensatory' },
        { label: 'Activity Logs', route: '/admin/reports/activity' }
      ]
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/admin/settings'
    }
  ];
  currentUser$!: Observable<any>;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser;

    this.authService.currentUser.subscribe(user => {
      this.isAdmin = user?.role === 'ADMIN';
    });
  }
  get menuItems(): MenuItem[] {
    return this.isAdmin ? this.adminMenuItems : this.memberMenuItems;
  }

  toggleMenu(label: string): void {
    if (this.expandedMenus.has(label)) {
      this.expandedMenus.delete(label);
    } else {
      this.expandedMenus.add(label);
    }
  }

  isMenuExpanded(label: string): boolean {
    return this.expandedMenus.has(label);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
    if (this.isMobile) {
      this.toggleSidebar.emit();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
