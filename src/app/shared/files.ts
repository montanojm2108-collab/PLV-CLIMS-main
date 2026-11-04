import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { jsPDF } from 'jspdf';
export async function exportFile(filename: string, mime: string, content: string | Uint8Array): Promise<void> {
    let base64: string;
    if (typeof content === 'string')
        base64 = btoa(unescape(encodeURIComponent(content)));
    else {
        let binary = '';
        for (const n of content)
            binary += String.fromCharCode(n);
        base64 = btoa(binary);
    }
    if (Capacitor.isNativePlatform()) {
        const result = await Filesystem.writeFile({ path: filename, data: base64, directory: Directory.Cache });
        await Share.share({ title: filename, url: result.uri, dialogTitle: 'Save or share ' + filename });
    }
    else {
        const blob = new Blob([typeof content === 'string' ? content : content as BlobPart], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
    }
}
export function asCsv(rows: (string | number)[][]): string { return rows.map(row => row.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\r\n'); }
export async function exportPdf(title: string, lines: string[], filename: string): Promise<void> { const pdf = new jsPDF(); pdf.setFontSize(18); pdf.text(title, 14, 18); pdf.setFontSize(10); let y = 32; for (const line of lines) {
    const wraps = pdf.splitTextToSize(line, 180) as string[];
    if (y + wraps.length * 6 > 280) {
        pdf.addPage();
        y = 18;
    }
    pdf.text(wraps, 14, y);
    y += wraps.length * 6 + 4;
} await exportFile(filename, 'application/pdf', new Uint8Array(pdf.output('arraybuffer'))); }
export async function readSmallImage(event: Event): Promise<string | undefined> { const input = event.target as HTMLInputElement; const file = input.files?.[0]; if (!file)
    return undefined; if (!file.type.startsWith('image/'))
    throw new Error('Select an image file.'); if (file.size > 650000)
    throw new Error('Image must be smaller than 650 KB for local demo storage.'); return await new Promise((resolve, reject) => { const r = new FileReader(); r.onerror = () => reject(new Error('Image could not be read.')); r.onload = () => resolve(String(r.result)); r.readAsDataURL(file); }); }
