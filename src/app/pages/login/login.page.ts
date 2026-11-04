import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { UiService } from '../../core/ui.service';
@Component({ standalone: true, imports: [CommonModule, IonicModule, ReactiveFormsModule], templateUrl: './login.page.html', styleUrls: ['./login.page.scss'] })
export class LoginPage {
    private fb = inject(FormBuilder);
    auth = inject(AuthService);
    ui = inject(UiService);
    router = inject(Router);
    error = '';
    form = this.fb.nonNullable.group({ handle: ['', [Validators.required]], password: ['', [Validators.required]], remember: [true] });
    async login() { if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
    } const f = this.form.getRawValue(); if (!this.auth.login(f.handle, f.password, f.remember)) {
        this.error = 'Invalid credentials or inactive demo account.';
        return;
    } this.error = ''; await this.router.navigateByUrl(this.auth.home(), { replaceUrl: true }); }
    async create() { const values = await this.ui.fields('Create demo student account', [{ name: 'name', placeholder: 'Full name' }, { name: 'email', type: 'email', placeholder: 'Email address' }, { name: 'password', type: 'password', placeholder: 'Password (6+ characters)' }]); if (!values)
        return; const { name, email, password } = values; if (!name?.trim() || !email?.includes('@') || !password || password.length < 6) {
        await this.ui.toast('Enter a name, valid email and 6-character password.', 'danger');
        return;
    } try {
        await this.ui.toast(this.auth.create(name.trim(), email.trim(), password) ? 'Student account created. You can sign in.' : 'Email already exists.', 'primary');
    }
    catch (e) {
        await this.ui.toast(String(e), 'danger');
    } }
    async forgot() { const values = await this.ui.fields('Reset local demo password', [{ name: 'email', type: 'email', placeholder: 'Registered email' }, { name: 'password', type: 'password', placeholder: 'New password (6+ characters)' }]); if (!values)
        return; if (!values['email'] || !values['password'] || values['password'].length < 6) {
        await this.ui.toast('Enter your email and a new password (6+ characters).', 'danger');
        return;
    } await this.ui.toast(this.auth.resetPassword(values['email'], values['password']) ? 'Demo password updated.' : 'Account not found.'); }
}
