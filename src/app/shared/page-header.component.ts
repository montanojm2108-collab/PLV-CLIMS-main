import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DataService } from '../core/data.service';
import { AuthService } from '../core/auth.service';
@Component({ selector: 'app-page-header', standalone: true, imports: [CommonModule, FormsModule, IonicModule], template: `
<ion-header class="ion-no-border"><ion-toolbar><ion-buttons slot="start"><ion-menu-button menu="main-menu" aria-label="Open navigation"></ion-menu-button></ion-buttons>
<ion-title>PLV-CLIMS <span class="sub">/ {{title}}</span></ion-title><ion-buttons slot="end"><ion-button (click)="goHome()" aria-label="Go to portal home"><ion-icon name="home-outline"></ion-icon></ion-button></ion-buttons></ion-toolbar></ion-header>
<div class="search-container"><input class="field" placeholder="Search labs, PCs, tickets..." aria-label="Global search" [(ngModel)]="query" (ngModelChange)="lookup()"><div class="search-results" *ngIf="query.trim()"><div class="no-results" *ngIf="!results.length">No matching records</div><button *ngFor="let item of results" (click)="open(item.path)">{{item.label}} <small>{{item.type}}</small></button></div></div>
`, styles: [`:host{display:block;background:white}ion-toolbar{--background:white;--color:#201420;--border-color:#e5e5ed;--min-height:56px}ion-title{font-weight:700;font-size:15px}.sub{font-weight:400;font-size:12px;color:#6B6B6B}.search-container{padding:6px 18px 10px;position:relative;max-width:600px;margin-left:auto}.field{height:36px;min-height:36px;font-size:12px;padding:8px}.search-results{position:absolute;top:46px;left:18px;right:18px;z-index:100;background:#fff;border:1px solid #d9dbe2;box-shadow:0 8px 20px #0002;max-height:240px;overflow:auto;border-radius:8px}.search-results button{padding:12px;display:block;width:100%;border:0;background:white;text-align:left;font:inherit;color:#201420;cursor:pointer}.search-results button:hover{background:#f4f3ff}.search-results small{float:right;color:#6B6B6B}.no-results{padding:12px;font-size:13px}@media(min-width:800px){.search-container{margin-top:-49px;margin-right:60px;height:0;padding:6px 0 0;width:240px;z-index:3}.search-results{top:43px;left:0;right:0}}@media(max-width:480px){.sub{display:none}}`] })
export class PageHeaderComponent {
    @Input()
    title = '';
    query = '';
    results: {
        label: string;
        type: string;
        path: string;
    }[] = [];
    data = inject(DataService);
    auth = inject(AuthService);
    router = inject(Router);
    lookup() { const q = this.query.trim().toLowerCase(); if (!q) {
        this.results = [];
        return;
    } const s = this.data.state(); this.results = [...s.labs.filter(x => x.name.toLowerCase().includes(q)).map(x => ({ label: x.name, type: 'Laboratory', path: '/student/laboratories/' + x.id })), ...s.computers.filter(x => x.name.toLowerCase().includes(q) || x.id.toLowerCase().includes(q)).slice(0, 8).map(x => ({ label: x.name + ' · ' + x.labId, type: 'Computer', path: '/student/computers/' + x.id })), ...(this.auth.role() === 'student' ? [] : s.tickets.filter(x => (x.id + ' ' + x.category).toLowerCase().includes(q)).map(x => ({ label: x.id + ' · ' + x.category, type: 'Ticket', path: '/tickets/' + x.id })))].slice(0, 12); }
    open(path: string) { this.query = ''; this.results = []; void this.router.navigateByUrl(path); }
    goHome() { void this.router.navigateByUrl(this.auth.home()); }
}
