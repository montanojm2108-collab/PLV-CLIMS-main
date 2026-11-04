import { Component, inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { UiService } from '../../core/ui.service';
import { readSmallImage } from '../../shared/files';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { Capacitor } from '@capacitor/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHintALLOption } from '@capacitor/barcode-scanner';
interface BarcodeResult {
    rawValue: string;
}
interface Detector {
    detect(source: HTMLVideoElement): Promise<BarcodeResult[]>;
}
@Component({ standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, PageHeaderComponent], templateUrl: './computer-inspection.page.html', styleUrls: ['./computer-inspection.page.scss'] })
export class ComputerInspectionPage implements OnDestroy {
    data = inject(DataService);
    auth = inject(AuthService);
    ui = inject(UiService);
    router = inject(Router);
    private fb = inject(FormBuilder);
    photo?: string;
    scanActive = false;
    private stream?: MediaStream;
    private timer?: number;
    @ViewChild('camera')
    camera?: ElementRef<HTMLVideoElement>;
    form = this.fb.nonNullable.group({ labId: ['', Validators.required], computerId: ['', Validators.required], monitor: ['Good', Validators.required], keyboard: ['Good', Validators.required], boot: ['Good', Validators.required], network: ['Good', Validators.required], notes: ['', Validators.required] });
    get computers() { return this.data.state().computers.filter(x => x.labId === this.form.controls.labId.value); }
    get computer() { return this.data.state().computers.find(c => c.id === this.form.controls.computerId.value); }
    onLab() { this.form.controls.computerId.setValue(''); }
    async file(e: Event) { try {
        this.photo = await readSmallImage(e);
    }
    catch (err) {
        await this.ui.toast(String(err), 'danger');
    } }
    async scan() { if (Capacitor.isNativePlatform()) {
        try {
            const result = await CapacitorBarcodeScanner.scanBarcode({ hint: CapacitorBarcodeScannerTypeHintALLOption.ALL, scanInstructions: 'Scan a PLV-CLIMS computer QR code' });
            await this.useCode(result.ScanResult);
        }
        catch {
            await this.ui.toast('Scan cancelled or camera unavailable. Choose a computer manually.', 'warning');
        }
        return;
    } const ctor = (window as unknown as {
        BarcodeDetector?: new (opts: {
            formats: string[];
        }) => Detector;
    }).BarcodeDetector; if (!ctor) {
        await this.ui.toast('Live QR scanning is unavailable here. Select or enter a computer ID manually.', 'warning');
        return;
    } try {
        this.scanActive = true;
        await new Promise<void>(r => setTimeout(r, 0));
        this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const video = this.camera?.nativeElement;
        if (!video)
            throw new Error('Camera preview unavailable');
        video.srcObject = this.stream;
        await video.play();
        const detector = new ctor({ formats: ['qr_code'] });
        this.timer = window.setInterval(async () => { try {
            const codes = await detector.detect(video);
            if (!codes.length)
                return;
            await this.useCode(codes[0].rawValue);
            this.stopScan();
        }
        catch { /* Camera frame may not be ready yet */ } }, 700);
    }
    catch {
        this.stopScan();
        await this.ui.toast('Camera unavailable or permission denied. Select the computer manually.', 'warning');
    } }
    async useCode(text: string) { const id = text.trim(); const computer = this.data.state().computers.find(c => c.id === id || c.name === id); if (!computer) {
        await this.ui.toast('QR code does not match a demo computer.', 'warning');
        return;
    } this.form.patchValue({ labId: computer.labId, computerId: computer.id }); await this.ui.toast('Computer selected from QR code.', 'success'); }
    stopScan() { if (this.timer)
        clearInterval(this.timer); this.timer = undefined; this.stream?.getTracks().forEach(t => t.stop()); this.stream = undefined; this.scanActive = false; }
    ngOnDestroy() { this.stopScan(); }
    async submit() { if (this.form.invalid) {
        this.form.markAllAsTouched();
        await this.ui.toast('Complete all required inspection fields.', 'danger');
        return;
    } const v = this.form.getRawValue(); try {
        this.data.update(s => s.inspections.unshift({ id: this.data.id('INSP'), ...v, authorId: this.auth.currentUser()!.id, createdAt: new Date().toISOString(), photo: this.photo }), this.auth.currentUser()?.name, 'Recorded observation for ' + v.computerId);
        await this.ui.toast('Observation saved locally.', 'success');
        await this.router.navigateByUrl('/technical/history');
    }
    catch (e) {
        await this.ui.toast(String(e), 'danger');
    } }
}
