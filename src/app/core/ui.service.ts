import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
@Injectable({ providedIn: 'root' })
export class UiService {
    constructor(private alerts: AlertController, private toasts: ToastController) { }
    async toast(message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'primary'): Promise<void> { const t = await this.toasts.create({ message, duration: 2300, color, position: 'bottom' }); await t.present(); }
    async confirm(header: string, message: string): Promise<boolean> { const dialog = await this.alerts.create({ header, message, buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Confirm', role: 'confirm' }] }); await dialog.present(); const result = await dialog.onDidDismiss(); return result.role === 'confirm'; }
    async fields(header: string, inputs: {
        name: string;
        type?: 'text' | 'email' | 'password' | 'number';
        placeholder: string;
        value?: string;
    }[]): Promise<Record<string, string> | null> {
        const alert = await this.alerts.create({ header, inputs: inputs.map(x => ({ ...x, type: x.type || 'text' })), buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Save', role: 'confirm' }] });
        await alert.present();
        const result = await alert.onDidDismiss();
        return result.role === 'confirm' ? (result.data?.values || {}) : null;
    }
}
