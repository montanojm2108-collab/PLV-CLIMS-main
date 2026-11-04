import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [CommonModule, FormsModule, IonicModule, PageHeaderComponent], templateUrl: './inspection-history.page.html', styleUrls: ['./inspection-history.page.scss'] })
export class InspectionHistoryPage {
    data = inject(DataService);
    auth = inject(AuthService);
    alerts = inject(AlertController);
    query = '';
    condition = 'All';
    get records() { return this.data.state().inspections.filter(i => (i.computerId + ' ' + i.labId + ' ' + i.notes).toLowerCase().includes(this.query.toLowerCase()) && (this.condition === 'All' || (this.condition === 'Good' ? [i.monitor, i.keyboard, i.boot, i.network].every(x => x === 'Good') : [i.monitor, i.keyboard, i.boot, i.network].some(x => x !== 'Good')))); }
    async open(id: string) { const i = this.data.state().inspections.find(x => x.id === id); if (!i)
        return; const a = await this.alerts.create({ header: i.computerId, subHeader: new Date(i.createdAt).toLocaleString(), message: `Monitor: ${i.monitor}<br>Keyboard/mouse: ${i.keyboard}<br>Boot: ${i.boot}<br>Network: ${i.network}<br>Notes: ${i.notes}`, buttons: ['Close'] }); await a.present(); }
}
