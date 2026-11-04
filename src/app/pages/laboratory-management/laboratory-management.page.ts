import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { UiService } from '../../core/ui.service';
import { ComputerStatus } from '../../core/models';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, PageHeaderComponent], templateUrl: './laboratory-management.page.html', styleUrls: ['./laboratory-management.page.scss'] })
export class LaboratoryManagementPage {
    data = inject(DataService);
    auth = inject(AuthService);
    ui = inject(UiService);
    router = inject(Router);
    private fb = inject(FormBuilder);
    query = '';
    labId = 'LAB-01';
    computerId = '';
    labEditId = '';
    showLab = false;
    labForm = this.fb.nonNullable.group({ name: ['', Validators.required], building: ['', Validators.required], room: ['', Validators.required], description: [''], active: [true] });
    pcForm = this.fb.nonNullable.group({ status: ['Working' as ComputerStatus], processor: ['', Validators.required], memory: ['', Validators.required], storage: ['', Validators.required], peripherals: ['', Validators.required], notes: [''] });
    get labs() { return this.data.state().labs.filter(l => (l.name + ' ' + l.building).toLowerCase().includes(this.query.toLowerCase())); }
    get pcs() { return this.data.state().computers.filter(c => c.labId === this.labId); }
    get computer() { return this.pcs.find(c => c.id === this.computerId); }
    get selectedLab() { return this.data.state().labs.find(l => l.id === this.labId); }
    newLab() { this.labEditId = ''; this.showLab = true; this.labForm.reset({ name: '', building: '', room: '', description: '', active: true }); }
    editLab() { const l = this.selectedLab; if (!l)
        return; this.labEditId = l.id; this.labForm.patchValue(l); this.showLab = true; }
    async saveLab() { if (this.labForm.invalid) {
        this.labForm.markAllAsTouched();
        return;
    } const v = this.labForm.getRawValue(); const oldId = this.labEditId; let newId = ''; this.data.update(s => { if (oldId)
        Object.assign(s.labs.find(l => l.id === oldId)!, v);
    else {
        newId = this.data.id('LAB');
        s.labs.push({ id: newId, ...v });
    } }, this.auth.currentUser()?.name, (oldId ? 'Updated' : 'Added') + ' laboratory ' + v.name); this.labId = oldId || newId; this.showLab = false; await this.ui.toast('Laboratory saved.', 'success'); }
    pickPc() { const c = this.computer; this.pcForm.patchValue({ status: c?.status || 'Working', processor: c?.processor || '', memory: c?.memory || '', storage: c?.storage || '', peripherals: c?.peripherals || '', notes: c?.notes || '' }); }
    async savePc() { if (!this.computer || this.pcForm.invalid)
        return; const v = this.pcForm.getRawValue(), id = this.computer.id; this.data.update(s => Object.assign(s.computers.find(c => c.id === id)!, v), this.auth.currentUser()?.name, 'Updated computer ' + id); await this.ui.toast('Computer details and status saved.', 'success'); }
    async addPc() {
        if (!this.labId)
            return;
        const n = this.pcs.length + 1;
        const label = `PC-${String(n).padStart(2, '0')}`;
        const id = this.labId + '-' + label;
        if (this.data.state().computers.some(c => c.id === id)) {
            await this.ui.toast('Computer ID exists. Choose a different laboratory.', 'warning');
            return;
        }
        this.data.update(s => s.computers.push({ id, labId: this.labId, name: label, status: 'Working', processor: 'Intel Core i5', memory: '8 GB RAM', storage: '256 GB SSD', peripherals: 'Monitor, keyboard, mouse', notes: '' }), this.auth.currentUser()?.name, 'Added computer ' + id);
        this.computerId = id;
        this.pickPc();
        await this.ui.toast('Computer added.', 'success');
    }
}
