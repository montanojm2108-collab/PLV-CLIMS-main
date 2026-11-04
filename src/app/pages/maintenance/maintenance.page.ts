import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { UiService } from '../../core/ui.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [CommonModule, FormsModule, IonicModule, PageHeaderComponent], templateUrl: './maintenance.page.html', styleUrls: ['./maintenance.page.scss'] })
export class MaintenancePage {
    data = inject(DataService);
    auth = inject(AuthService);
    ui = inject(UiService);
    router = inject(Router);
    query = '';
    get records() { return this.data.state().maintenance.filter(m => (m.computerId + ' ' + m.detail).toLowerCase().includes(this.query.toLowerCase())); }
    async explain() { await this.ui.toast('Repair completion is recorded by an administrator after external maintenance verification.', 'warning'); }
    async addRecord() { if (this.auth.role() !== 'admin')
        return this.explain(); const val = await this.ui.fields('Record external maintenance', [{ name: 'pc', placeholder: 'Computer ID, e.g. LAB-01-PC-04' }, { name: 'detail', placeholder: 'Service notes' }]); if (!val)
        return; const pc = this.data.state().computers.find(c => c.id === val['pc']); if (!pc || !val['detail']?.trim()) {
        await this.ui.toast('Enter an existing computer ID and service notes.', 'danger');
        return;
    } this.data.update(s => s.maintenance.unshift({ id: this.data.id('MT'), computerId: pc.id, detail: val['detail'], date: this.data.now(), status: 'Recorded by administrator' }), this.auth.currentUser()?.name, 'Recorded external maintenance for ' + pc.id); await this.ui.toast('Maintenance record saved.', 'success'); }
}
