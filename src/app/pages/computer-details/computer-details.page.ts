import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { UiService } from '../../core/ui.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { ComputerStatus } from '../../core/models';
@Component({ standalone: true, imports: [CommonModule, FormsModule, IonicModule, PageHeaderComponent], templateUrl: './computer-details.page.html', styleUrls: ['./computer-details.page.scss'] })
export class ComputerDetailsPage implements OnInit {
    data = inject(DataService);
    auth = inject(AuthService);
    ui = inject(UiService);
    route = inject(ActivatedRoute);
    router = inject(Router);
    id = '';
    status: ComputerStatus = 'Working';
    notes = '';
    ngOnInit() { this.route.paramMap.subscribe(p => { this.id = p.get('id') || ''; this.status = this.computer?.status || 'Working'; this.notes = this.computer?.notes || ''; }); }
    get computer() { return this.data.state().computers.find(c => c.id === this.id); }
    get lab() { return this.data.state().labs.find(l => l.id === this.computer?.labId); }
    get tickets() { return this.data.state().tickets.filter(t => t.computerId === this.id); }
    async save() { if (this.auth.role() !== 'admin')
        return; this.data.update(s => { const c = s.computers.find(x => x.id === this.id); if (c) {
        c.status = this.status;
        c.notes = this.notes;
    } }, this.auth.currentUser()?.name, 'Updated ' + this.id); await this.ui.toast('Computer details saved.', 'success'); }
    async report() { if (this.auth.role() === 'technical') {
        void this.router.navigate(['/technical/tickets/new'], { queryParams: { computer: this.id } });
        return;
    } await this.ui.toast('Only technical representatives may create issue tickets.', 'warning'); }
}
