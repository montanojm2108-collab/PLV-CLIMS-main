import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { UiService } from '../../core/ui.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [CommonModule, FormsModule, IonicModule, PageHeaderComponent], templateUrl: './announcements.page.html', styleUrls: ['./announcements.page.scss'] })
export class AnnouncementsPage {
    data = inject(DataService);
    auth = inject(AuthService);
    ui = inject(UiService);
    alerts = inject(AlertController);
    query = '';
    get items() { return this.data.state().announcements.filter(a => !a.archived && (a.title + ' ' + a.body).toLowerCase().includes(this.query.toLowerCase())); }
    read(id: string) { return this.data.state().announcements.find(a => a.id === id)?.readBy.includes(this.auth.currentUser()?.id || '') || false; }
    async open(id: string) { const a = this.data.state().announcements.find(a => a.id === id); if (!a)
        return; const alert = await this.alerts.create({ header: a.title, subHeader: a.category, message: a.body, buttons: ['Close'] }); await alert.present(); this.data.update(s => { const match = s.announcements.find(x => x.id === id); const uid = this.auth.currentUser()?.id || ''; if (match && !match.readBy.includes(uid))
        match.readBy.push(uid); }); }
    async markAll() { const uid = this.auth.currentUser()?.id || ''; this.data.update(s => s.announcements.forEach(a => { if (!a.readBy.includes(uid))
        a.readBy.push(uid); })); await this.ui.toast('All announcements marked as read.', 'success'); }
}
