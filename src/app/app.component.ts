import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { homeOutline, gridOutline, businessOutline, desktopOutline, ticketOutline, addCircleOutline, clipboardOutline, timeOutline, constructOutline, megaphoneOutline, peopleOutline, settingsOutline, personOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from './core/auth.service';
interface NavLink {
    title: string;
    path: string;
    icon: string;
}
@Component({ selector: 'app-root', standalone: true, imports: [CommonModule, IonicModule, RouterLink, RouterLinkActive], templateUrl: './app.component.html', styleUrls: ['./app.component.scss'] })
export class AppComponent {
    constructor() { addIcons({ homeOutline, gridOutline, businessOutline, desktopOutline, ticketOutline, addCircleOutline, clipboardOutline, timeOutline, constructOutline, megaphoneOutline, peopleOutline, settingsOutline, personOutline, logOutOutline }); }
    auth = inject(AuthService);
    desktopMenuVisible = false;
    readonly student: NavLink[] = [{ title: 'Dashboard', path: '/student/dashboard', icon: 'grid-outline' }, { title: 'Laboratories', path: '/student/laboratories', icon: 'business-outline' }, { title: 'Computer Map', path: '/student/laboratories/LAB-01', icon: 'desktop-outline' }, { title: 'Announcements', path: '/announcements', icon: 'megaphone-outline' }, { title: 'My Account', path: '/account', icon: 'person-outline' }];
    readonly technical: NavLink[] = [{ title: 'Dashboard', path: '/technical/dashboard', icon: 'grid-outline' }, { title: 'Laboratories', path: '/student/laboratories', icon: 'business-outline' }, { title: 'Tickets', path: '/technical/tickets', icon: 'desktop-outline' }, { title: 'Create Ticket', path: '/technical/tickets/new', icon: 'add-circle-outline' }, { title: 'Inspections', path: '/technical/inspection', icon: 'clipboard-outline' }, { title: 'Inspection History', path: '/technical/history', icon: 'time-outline' }, { title: 'Maintenance', path: '/technical/maintenance', icon: 'settings-outline' }, { title: 'Announcements', path: '/announcements', icon: 'megaphone-outline' }, { title: 'My Account', path: '/account', icon: 'person-outline' }];
    readonly admin: NavLink[] = [{ title: 'User Management', path: '/admin/users', icon: 'person-outline' }, { title: 'Laboratory Management', path: '/admin/laboratories', icon: 'business-outline' }, { title: 'Computer Map', path: '/student/laboratories', icon: 'desktop-outline' }, { title: 'Tickets', path: '/technical/tickets', icon: 'ticket-outline' }, { title: 'Announcements & Reports', path: '/admin/reports', icon: 'grid-outline' }, { title: 'Inspection History', path: '/technical/history', icon: 'time-outline' }, { title: 'Maintenance', path: '/technical/maintenance', icon: 'settings-outline' }, { title: 'Settings & Audit Logs', path: '/admin/settings', icon: 'settings-outline' }, { title: 'My Account', path: '/account', icon: 'person-outline' }];
    get links(): NavLink[] { return this.auth.role() === 'student' ? this.student : this.auth.role() === 'technical' ? this.technical : this.admin; }
    get portal(): string { return this.auth.role() === 'student' ? 'STUDENT PORTAL' : this.auth.role() === 'technical' ? 'TECHNICAL PORTAL' : 'ADMIN PORTAL'; }
}
