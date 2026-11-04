import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [CommonModule, IonicModule, PageHeaderComponent], templateUrl: './technical-dashboard.page.html', styleUrls: ['./technical-dashboard.page.scss'] })
export class TechnicalDashboardPage {
    data = inject(DataService);
    auth = inject(AuthService);
    router = inject(Router);
    get active() { return this.data.state().tickets.filter(t => t.status !== 'Closed' && t.status !== 'Resolved').length; }
    get mine() { return this.data.state().tickets.filter(t => t.reporterId === this.auth.currentUser()?.id).length; }
    get resolved() { return this.data.state().tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length; }
    get computers() { return this.data.state().computers.filter(c => c.labId === 'LAB-01').slice(0, 24); }
    go(path: string) { void this.router.navigateByUrl(path); }
}
