import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { UiService } from '../../core/ui.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { readSmallImage } from '../../shared/files';
@Component({ standalone: true, imports: [CommonModule, ReactiveFormsModule, IonicModule, PageHeaderComponent], templateUrl: './my-account.page.html', styleUrls: ['./my-account.page.scss'] })
export class MyAccountPage implements OnInit {
    auth = inject(AuthService);
    data = inject(DataService);
    ui = inject(UiService);
    private fb = inject(FormBuilder);
    form = this.fb.nonNullable.group({ name: ['', Validators.required], studentId: [''], email: ['', [Validators.required, Validators.email]], notifications: [true] });
    ngOnInit() { const u = this.auth.currentUser(); if (u)
        this.form.patchValue({ name: u.name, studentId: u.studentId || '', email: u.email, notifications: u.notifications }); }
    async save() { if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
    } const id = this.auth.currentUser()?.id; const f = this.form.getRawValue(); if (!id)
        return; const duplicate = this.data.state().users.some(u => u.id !== id && u.email.toLowerCase() === f.email.toLowerCase()); if (duplicate) {
        await this.ui.toast('Email is already used.', 'danger');
        return;
    } this.data.update(s => { const user = s.users.find(x => x.id === id)!; user.name = f.name; user.email = f.email; user.studentId = f.studentId; user.notifications = f.notifications; }, f.name, 'Updated profile'); await this.ui.toast('Profile saved.', 'success'); }
    async photo(event: Event) { try {
        const photo = await readSmallImage(event);
        const u = this.auth.currentUser();
        if (photo && u) {
            this.data.update(s => s.users.find(x => x.id === u.id)!.avatar = photo, u.name, 'Updated profile photo');
            await this.ui.toast('Profile photo saved locally.', 'success');
        }
    }
    catch (e) {
        await this.ui.toast(String(e), 'danger');
    } }
    async password() { const v = await this.ui.fields('Change demo password', [{ name: 'current', type: 'password', placeholder: 'Current password' }, { name: 'next', type: 'password', placeholder: 'New password (6+ characters)' }]); if (!v)
        return; const u = this.auth.currentUser(); if (!u || v['current'] !== u.password || !v['next'] || v['next'].length < 6) {
        await this.ui.toast('Check current password and new password length.', 'danger');
        return;
    } this.data.update(s => s.users.find(x => x.id === u.id)!.password = v['next'], u.name, 'Changed demo password'); await this.ui.toast('Password updated locally.', 'success'); }
}
