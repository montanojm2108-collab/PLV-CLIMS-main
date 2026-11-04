import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { UiService } from '../../core/ui.service';
import { TicketStatus } from '../../core/models';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [CommonModule, FormsModule, IonicModule, PageHeaderComponent], templateUrl: './ticket-details.page.html', styleUrls: ['./ticket-details.page.scss'] })
export class TicketDetailsPage implements OnInit {
    data = inject(DataService);
    auth = inject(AuthService);
    ui = inject(UiService);
    route = inject(ActivatedRoute);
    router = inject(Router);
    id = '';
    status: TicketStatus = 'Open';
    assignee = '';
    updateText = '';
    ngOnInit() { this.route.paramMap.subscribe(p => { this.id = p.get('id') || ''; this.status = this.ticket?.status || 'Open'; this.assignee = this.ticket?.assignee || ''; }); }
    get ticket() { return this.data.state().tickets.find(t => t.id === this.id); }
    get computer() { return this.data.state().computers.find(c => c.id === this.ticket?.computerId); }
    get lab() { return this.data.state().labs.find(l => l.id === this.ticket?.labId); }
    async save() { if (this.auth.role() !== 'admin')
        return; const user = this.auth.currentUser()!; this.data.update(s => { const t = s.tickets.find(t => t.id === this.id)!; t.status = this.status; t.assignee = this.assignee; t.updatedAt = this.data.now(); t.history.unshift({ date: t.updatedAt, by: user.name, message: 'Status set to ' + this.status + '; assigned to ' + (this.assignee || 'Unassigned') }); }, user.name, 'Updated ticket ' + this.id); await this.ui.toast('Administrative ticket update saved.', 'success'); }
    async add() { if (!this.updateText.trim()) {
        await this.ui.toast('Enter an observation or update first.', 'warning');
        return;
    } const user = this.auth.currentUser()!; this.data.update(s => { const t = s.tickets.find(t => t.id === this.id)!; t.history.unshift({ date: this.data.now(), by: user.name, message: this.updateText.trim() }); t.updatedAt = this.data.now(); }, user.name, 'Added note to ' + this.id); this.updateText = ''; await this.ui.toast('Update recorded.', 'success'); }
}
