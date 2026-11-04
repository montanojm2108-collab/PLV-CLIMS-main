import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { UiService } from '../../core/ui.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { Role } from '../../core/models';
@Component({ standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, PageHeaderComponent], templateUrl: './user-management.page.html', styleUrls: ['./user-management.page.scss'] })
export class UserManagementPage {
    data = inject(DataService);
    auth = inject(AuthService);
    ui = inject(UiService);
    private fb = inject(FormBuilder);
    query = '';
    filter = 'All';
    editingId = '';
    showForm = false;
    form = this.fb.nonNullable.group({ name: ['', Validators.required], email: ['', [Validators.required, Validators.email]], password: [''], role: ['student' as Role, Validators.required], studentId: [''] });
    get users() { return this.data.state().users.filter(u => (u.name + ' ' + u.email).toLowerCase().includes(this.query.toLowerCase()) && (this.filter === 'All' || u.role === this.filter)); }
    add() { this.editingId = ''; this.form.reset({ name: '', email: '', password: '', role: 'student', studentId: '' }); this.showForm = true; }
    edit(id: string) { const u = this.data.state().users.find(x => x.id === id); if (!u)
        return; this.editingId = id; this.form.patchValue({ name: u.name, email: u.email, password: '', role: u.role, studentId: u.studentId || '' }); this.showForm = true; }
    cancel() { this.showForm = false; this.editingId = ''; }
    async save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const v = this.form.getRawValue();
        if (!this.editingId && v.password.length < 6) {
            await this.ui.toast('New demo users require a 6-character password.', 'danger');
            return;
        }
        if (this.editingId && this.auth.currentUser()?.id === this.editingId && v.role !== 'admin') {
            await this.ui.toast('You cannot revoke your current administrator role.', 'danger');
            return;
        }
        if (this.data.state().users.some(u => u.email.toLowerCase() === v.email.toLowerCase() && u.id !== this.editingId)) {
            await this.ui.toast('Email is already in use.', 'danger');
            return;
        }
        const id = this.editingId;
        this.data.update(s => { if (id) {
            const u = s.users.find(x => x.id === id)!;
            u.name = v.name;
            u.email = v.email;
            u.role = v.role;
            u.studentId = v.studentId;
            if (v.password)
                u.password = v.password;
        }
        else {
            s.users.push({ id: this.data.id('U'), name: v.name, email: v.email, password: v.password, role: v.role, studentId: v.studentId, active: true, notifications: true });
        } }, this.auth.currentUser()?.name, (id ? 'Updated' : 'Created') + ' demo user ' + v.email);
        this.cancel();
        await this.ui.toast('User record saved.', 'success');
    }
    async toggle(id: string) { const u = this.data.state().users.find(x => x.id === id); if (!u)
        return; if (id === this.auth.currentUser()?.id) {
        await this.ui.toast('You cannot deactivate your own account.', 'warning');
        return;
    } if (!await this.ui.confirm(u.active ? 'Deactivate user' : 'Reactivate user', `Change account access for ${u.name}?`))
        return; this.data.update(s => { s.users.find(x => x.id === id)!.active = !u.active; }, this.auth.currentUser()?.name, (u.active ? 'Deactivated' : 'Reactivated') + ' ' + u.name); await this.ui.toast('Account status updated.', 'success'); }
}
