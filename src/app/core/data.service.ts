import { Injectable, signal } from '@angular/core';
import { AppData } from './models';
import { freshData } from './mock-data';
const KEY = 'plv-clims-demo-v1';
@Injectable({ providedIn: 'root' })
export class DataService {
    readonly state = signal<AppData>(this.read());
    private read(): AppData { try {
        const s = localStorage.getItem(KEY);
        return s ? JSON.parse(s) as AppData : freshData();
    }
    catch {
        return freshData();
    } }
    update(action: (s: AppData) => void, actor = 'System', description?: string): void {
        const next: AppData = JSON.parse(JSON.stringify(this.state()));
        action(next);
        if (description)
            next.audit.unshift({ id: crypto.randomUUID(), date: new Date().toISOString(), actor, action: description });
        try {
            localStorage.setItem(KEY, JSON.stringify(next));
        }
        catch (e) {
            throw new Error('Local storage is full. Choose a smaller image or export and reset demo data.');
        }
        this.state.set(next);
    }
    reset(): void { const next = freshData(); localStorage.setItem(KEY, JSON.stringify(next)); this.state.set(next); }
    now(): string { return new Date().toISOString(); }
    id(prefix: string): string { return `${prefix}-${Date.now().toString(36).toUpperCase()}`; }
}
