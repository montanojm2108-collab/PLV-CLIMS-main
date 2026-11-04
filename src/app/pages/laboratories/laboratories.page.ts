import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [CommonModule, FormsModule, IonicModule, PageHeaderComponent], templateUrl: './laboratories.page.html', styleUrls: ['./laboratories.page.scss'] })
export class LaboratoriesPage {
    data = inject(DataService);
    router = inject(Router);
    query = '';
    building = 'all';
    availability = 'all';
    get buildings() { return [...new Set(this.data.state().labs.map(l => l.building))]; }
    get labs() { return this.data.state().labs.filter(l => (l.name + ' ' + l.building + ' ' + l.room).toLowerCase().includes(this.query.toLowerCase()) && (this.building === 'all' || l.building === this.building) && (this.availability === 'all' || (this.availability === 'open' ? l.active : !l.active))); }
    count(id: string) { return this.data.state().computers.filter(c => c.labId === id).length; }
    go(id: string) { void this.router.navigateByUrl('/student/laboratories/' + id); }
}
