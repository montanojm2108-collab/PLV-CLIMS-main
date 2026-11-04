import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [CommonModule, FormsModule, IonicModule, PageHeaderComponent], templateUrl: './ticket-list.page.html', styleUrls: ['./ticket-list.page.scss'] })
export class TicketListPage {
    data = inject(DataService);
    auth = inject(AuthService);
    router = inject(Router);
    query = '';
    status = 'All';
    priority = 'All';
    get tickets() { return this.data.state().tickets.filter(t => (t.id + ' ' + t.category + ' ' + t.description).toLowerCase().includes(this.query.toLowerCase()) && (this.status === 'All' || t.status === this.status) && (this.priority === 'All' || t.priority === this.priority)); }
    go(id: string) { void this.router.navigateByUrl('/tickets/' + id); }
}
