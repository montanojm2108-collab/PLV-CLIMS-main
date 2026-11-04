import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { UiService } from '../../core/ui.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { exportFile } from '../../shared/files';
@Component({ standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, PageHeaderComponent], templateUrl: './settings-audit.page.html', styleUrls: ['./settings-audit.page.scss'] })
export class SettingsAuditPage {
    data = inject(DataService);
    auth = inject(AuthService);
    ui = inject(UiService);
    private fb = inject(FormBuilder);
    query = '';
    form = this.fb.nonNullable.group({ notifications: [this.data.state().settings.notifications], maintenanceReminders: [this.data.state().settings.maintenanceReminders], sessionTimeout: [this.data.state().settings.sessionTimeout, [Validators.required, Validators.min(5), Validators.max(240)]] });
    get logs() { return this.data.state().audit.filter(l => (l.action + ' ' + l.actor).toLowerCase().includes(this.query.toLowerCase())).slice(0, 100); }
    async save() { if (this.form.invalid) {
        this.form.markAllAsTouched();
        await this.ui.toast('Session timeout must be 5 to 240 minutes.', 'danger');
        return;
    } const v = this.form.getRawValue(); this.data.update(s => s.settings = v, this.auth.currentUser()?.name, 'Updated local system preferences'); await this.ui.toast('Settings saved locally.', 'success'); }
    async backup() { try {
        await exportFile('PLV-CLIMS-local-backup.json', 'application/json', JSON.stringify(this.data.state(), null, 2));
        await this.ui.toast('Demo backup prepared.', 'success');
    }
    catch (e) {
        await this.ui.toast(String(e), 'danger');
    } }
    async reset() { if (!await this.ui.confirm('Reset all demo data', 'This permanently replaces local records, tickets and accounts with the initial sample dataset. Export a backup first if needed.'))
        return; this.data.reset(); this.form.patchValue(this.data.state().settings); await this.ui.toast('Demo data restored.', 'success'); }
}
