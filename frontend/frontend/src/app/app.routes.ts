// frontend/src/app/app.routes.ts - UPDATED WITH MEMBERS
import { Routes } from '@angular/router';
import { authGuard, memberGuard, adminGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Member routes
  {
    path: 'member',
    component: MainLayoutComponent,
    canActivate: [authGuard, memberGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/member-dashboard/member-dashboard.component')
          .then(m => m.MemberDashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/user-profile/user-profile.component')
          .then(m => m.UserProfileComponent)
      },
      {
        path: 'profile/edit',
        loadComponent: () => import('./features/profile/edit-profile/edit-profile.component')
          .then(m => m.EditProfileComponent)
      },
      {
        path: 'beneficiaries',
        loadComponent: () => import('./features/beneficiaries/beneficiary-list/beneficiary-list.component')
          .then(m => m.BeneficiaryListComponent)
      },
      {
        path: 'beneficiaries/add',
        loadComponent: () => import('./features/beneficiaries/add-beneficiary/add-beneficiary.component')
          .then(m => m.AddBeneficiaryComponent)
      },
      {
        path: 'contributions',
        children: [
          {
            path: 'submit',
            loadComponent: () => import('./features/contributions/submit-contribution/submit-contribution.component')
              .then(m => m.SubmitContributionComponent)
          },
          {
            path: 'history',
            loadComponent: () => import('./features/contributions/contribution-history/contribution-history.component')
              .then(m => m.ContributionHistoryComponent)
          }
        ]
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/documents/document-list/document-list.component')
          .then(m => m.DocumentListComponent)
      },
      {
        path: 'documents/upload',
        loadComponent: () => import('./features/documents/upload-document/upload-document.component')
          .then(m => m.UploadDocumentComponent)
      },
      {
        path: 'applications',
        loadComponent: () => import('./features/applications/application-list/application-list.component')
          .then(m => m.ApplicationListComponent)
      },
      {
        path: 'applications/new',
        loadComponent: () => import('./features/applications/application-form/application-form.component')
          .then(m => m.ApplicationFormComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/account-settings/account-settings.component')
          .then(m => m.AccountSettingsComponent)
      }
    ]
  },

  // Admin routes
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-dashboard.component')
          .then(m => m.AdminDashboardComponent)
      },
      // NEW MEMBERS ROUTE
      {
        path: 'members',
        loadComponent: () => import('./features/admin/members-list/members-list.component')
          .then(m => m.MembersListComponent)
      },
      {
        path: 'members/:id',
        loadComponent: () => import('./features/admin/member-details/member-details.component')
          .then(m => m.MemberDetailsComponent)
      },
      {
        path: 'contributions/pending',
        loadComponent: () => import('./features/contributions/verify-contribution/verify-contribution.component')
          .then(m => m.VerifyContributionComponent)
      },
      {
        path: 'contributions/:id/verify',
        loadComponent: () => import('./features/contributions/verify-contribution/verify-contribution.component')
          .then(m => m.VerifyContributionComponent)
      },
      {
        path: 'contributions/all',
        loadComponent: () => import('./features/contributions/contribution-history/contribution-history.component')
          .then(m => m.ContributionHistoryComponent)
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/documents/document-list/document-list.component')
          .then(m => m.DocumentListComponent)
      },
      {
        path: 'applications',
        loadComponent: () => import('./features/applications/application-list/application-list.component')
          .then(m => m.ApplicationListComponent)
      },
      {
        path: 'applications/:id/review',
        loadComponent: () => import('./features/applications/admin-review/admin-review.component')
          .then(m => m.AdminReviewComponent)
      },
      {
        path: 'reports/financial',
        loadComponent: () => import('./features/reports/financial-reports/financial-reports.component')
          .then(m => m.FinancialReportsComponent)
      },
      {
        path: 'reports/activity',
        loadComponent: () => import('./features/reports/activity-logs/activity-logs.component')
          .then(m => m.ActivityLogsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/account-settings/account-settings.component')
          .then(m => m.AccountSettingsComponent)
      }
    ]
  },

  // Shared routes (both member and admin)
  {
    path: 'notifications',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    loadComponent: () => import('./features/notifications/notification-center/notification-center.component')
      .then(m => m.NotificationCenterComponent)
  },

  // 404
  {
    path: '**',
    redirectTo: '/login'
  }
];
