import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MemberDashboardComponent } from './components/member-dashboard/member-dashboard.component';
import { authGuard, memberGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'member',
    canActivate: [authGuard, memberGuard],
    children: [
      { path: '', component: MemberDashboardComponent }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
