// frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MemberDashboardComponent } from './components/member-dashboard/member-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { SubmitContributionComponent } from './components/submit-contribution/submit-contribution.component';
import { MemberContributionsComponent } from './components/member-contributions/member-contributions.component';
import { AdminVerifyContributionsComponent } from './components/admin-verify-contributions/admin-verify-contributions.component';
import { authGuard, memberGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Member routes
  {
    path: 'member',
    canActivate: [authGuard, memberGuard],
    children: [
      { path: '', component: MemberDashboardComponent },
      { path: 'submit-contribution', component: SubmitContributionComponent },
      { path: 'contributions', component: MemberContributionsComponent }
    ]
  },

  // Admin routes
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'verify/:id', component: AdminVerifyContributionsComponent }
    ]
  },

  { path: '**', redirectTo: '/login' }
];
