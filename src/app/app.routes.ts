import { Routes } from '@angular/router';
import { authenticated, guest, roles } from './core/guards';
export const routes: Routes = [
    { path: 'login', canActivate: [guest], loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
    { path: 'student/dashboard', canActivate: [authenticated, roles('student')], loadComponent: () => import('./pages/student-dashboard/student-dashboard.page').then(m => m.StudentDashboardPage) },
    { path: 'student/laboratories', canActivate: [authenticated, roles('student', 'technical', 'admin')], loadComponent: () => import('./pages/laboratories/laboratories.page').then(m => m.LaboratoriesPage) },
    { path: 'student/laboratories/:labId', canActivate: [authenticated, roles('student', 'technical', 'admin')], loadComponent: () => import('./pages/lab-layout/lab-layout.page').then(m => m.LabLayoutPage) },
    { path: 'student/computers/:id', canActivate: [authenticated, roles('student', 'technical', 'admin')], loadComponent: () => import('./pages/computer-details/computer-details.page').then(m => m.ComputerDetailsPage) },
    { path: 'announcements', canActivate: [authenticated], loadComponent: () => import('./pages/announcements/announcements.page').then(m => m.AnnouncementsPage) },
    { path: 'account', canActivate: [authenticated], loadComponent: () => import('./pages/my-account/my-account.page').then(m => m.MyAccountPage) },
    { path: 'technical/dashboard', canActivate: [authenticated, roles('technical')], loadComponent: () => import('./pages/technical-dashboard/technical-dashboard.page').then(m => m.TechnicalDashboardPage) },
    { path: 'technical/inspection', canActivate: [authenticated, roles('technical')], loadComponent: () => import('./pages/computer-inspection/computer-inspection.page').then(m => m.ComputerInspectionPage) },
    { path: 'technical/tickets', canActivate: [authenticated, roles('technical', 'admin')], loadComponent: () => import('./pages/ticket-list/ticket-list.page').then(m => m.TicketListPage) },
    { path: 'technical/tickets/new', canActivate: [authenticated, roles('technical')], loadComponent: () => import('./pages/create-ticket/create-ticket.page').then(m => m.CreateTicketPage) },
    { path: 'tickets/:id', canActivate: [authenticated, roles('technical', 'admin')], loadComponent: () => import('./pages/ticket-details/ticket-details.page').then(m => m.TicketDetailsPage) },
    { path: 'technical/maintenance', canActivate: [authenticated, roles('technical', 'admin')], loadComponent: () => import('./pages/maintenance/maintenance.page').then(m => m.MaintenancePage) },
    { path: 'technical/history', canActivate: [authenticated, roles('technical', 'admin')], loadComponent: () => import('./pages/inspection-history/inspection-history.page').then(m => m.InspectionHistoryPage) },
    { path: 'admin/users', canActivate: [authenticated, roles('admin')], loadComponent: () => import('./pages/user-management/user-management.page').then(m => m.UserManagementPage) },
    { path: 'admin/laboratories', canActivate: [authenticated, roles('admin')], loadComponent: () => import('./pages/laboratory-management/laboratory-management.page').then(m => m.LaboratoryManagementPage) },
    { path: 'admin/reports', canActivate: [authenticated, roles('admin')], loadComponent: () => import('./pages/announcements-reports/announcements-reports.page').then(m => m.AnnouncementsReportsPage) },
    { path: 'admin/settings', canActivate: [authenticated, roles('admin')], loadComponent: () => import('./pages/settings-audit/settings-audit.page').then(m => m.SettingsAuditPage) },
    { path: '', pathMatch: 'full', redirectTo: 'login' }, { path: '**', redirectTo: 'login' }
];
