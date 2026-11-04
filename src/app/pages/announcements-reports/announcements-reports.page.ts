import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { UiService } from '../../core/ui.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { asCsv, exportFile, exportPdf } from '../../shared/files';
@Component({ standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, PageHeaderComponent], templateUrl: './announcements-reports.page.html', styleUrls: ['./announcements-reports.page.scss'] })
export class AnnouncementsReportsPage {
    data = inject(DataService);
    auth = inject(AuthService);
    ui = inject(UiService);
    private fb = inject(FormBuilder);
    showForm = false;
    editingId = '';
    reportType = 'Computer condition';
    dateFrom = '';
    dateTo = '';
    form = this.fb.nonNullable.group({ title: ['', Validators.required], body: ['', Validators.required], category: ['Reminder', Validators.required] });
    get announcements() { return this.data.state().announcements.filter(a => !a.archived); }
    newAnnouncement() { this.showForm = true; this.editingId = ''; this.form.reset({ title: '', body: '', category: 'Reminder' }); }
    edit(id: string) { const a = this.data.state().announcements.find(a => a.id === id); if (!a)
        return; this.editingId = id; this.form.patchValue(a); this.showForm = true; }
    async save() { if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
    } const v = this.form.getRawValue(), id = this.editingId; this.data.update(s => { if (id)
        Object.assign(s.announcements.find(a => a.id === id)!, v);
    else
        s.announcements.unshift({ id: this.data.id('ANN'), ...v, date: this.data.now(), archived: false, readBy: [] }); }, this.auth.currentUser()?.name, (id ? 'Edited' : 'Published') + ' announcement ' + v.title); this.showForm = false; await this.ui.toast('Announcement saved.', 'success'); }
    async archive(id: string) { if (!await this.ui.confirm('Archive announcement', 'Remove this announcement from active notices?'))
        return; this.data.update(s => s.announcements.find(a => a.id === id)!.archived = true, this.auth.currentUser()?.name, 'Archived announcement ' + id); await this.ui.toast('Announcement archived.', 'success'); }
    get reportRows(): (string | number)[][] { const s = this.data.state(); if (this.reportType === 'Computer condition')
        return [['Computer', 'Laboratory', 'Status', 'Processor'], ...s.computers.map(c => [c.name, c.labId, c.status, c.processor])]; if (this.reportType === 'Ticket resolution')
        return [['Ticket', 'Category', 'Status', 'Priority', 'Reported'], ...s.tickets.filter(t => this.inRange(t.createdAt)).map(t => [t.id, t.category, t.status, t.priority, t.createdAt])]; return [['Record', 'Computer', 'Detail', 'Status', 'Date'], ...s.inspections.filter(i => this.inRange(i.createdAt)).map(i => [i.id, i.computerId, 'Observation: ' + i.notes, 'Recorded', i.createdAt]), ...s.maintenance.filter(m => this.inRange(m.date)).map(m => [m.id, m.computerId, m.detail, m.status, m.date])]; }
    inRange(iso: string) { const day = iso.slice(0, 10); return (!this.dateFrom || day >= this.dateFrom) && (!this.dateTo || day <= this.dateTo); }
    async export(format: 'csv' | 'pdf') { try {
        const rows = this.reportRows;
        if (format === 'csv')
            await exportFile('PLV-CLIMS-report.csv', 'text/csv', asCsv(rows));
        else
            await exportPdf('PLV-CLIMS · ' + this.reportType, rows.map(r => r.join(' | ')), 'PLV-CLIMS-report.pdf');
        await this.ui.toast('Report file prepared.', 'success');
    }
    catch (e) {
        await this.ui.toast('Export failed: ' + String(e), 'danger');
    } }
}
