import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService, FieldTask, TaskStats, User } from '../../core/api.service';
@Component({
  standalone: true, imports: [NgFor, NgIf, DatePipe, RouterLink],
  template: `
  <div class="min-h-screen">
    <header class="border-b border-border bg-surface">
      <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <a routerLink="/app/tasks" class="font-display text-xl font-semibold text-primary">SURCO</a>
        <div class="flex items-center gap-4 text-sm">
          <span class="rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold text-primary">{{ user?.role }}</span>
          <span class="text-ink-muted">{{ user?.name }}</span>
          <a *ngIf="user?.role==='FARMER'" routerLink="/app/tasks/new" class="rounded-full bg-primary px-4 py-2 font-semibold text-white">+ Tarea</a>
          <button type="button" class="text-ink-muted hover:text-ink" (click)="logout()">Salir</button>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-10">
      <p class="text-xs font-bold tracking-[0.12em] text-straw">{{ user?.role==='FARMER' ? 'CUADERNO DE CAMPO' : 'MIS ASIGNACIONES' }}</p>
      <h1 class="mt-2 font-display text-3xl font-semibold">{{ user?.role==='FARMER' ? 'Tareas de parcela' : 'Tareas técnicas' }}</h1>
      <div *ngIf="stats" class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div class="rounded-2xl border border-border bg-surface p-4"><p class="text-[11px] font-bold text-ink-muted">TOTAL</p><p class="font-display text-2xl font-semibold">{{ stats.total }}</p></div>
        <div class="rounded-2xl border border-border bg-surface p-4"><p class="text-[11px] font-bold text-ink-muted">ABIERTAS</p><p class="font-display text-2xl font-semibold">{{ stats.open }}</p></div>
        <div class="rounded-2xl border border-border bg-surface p-4"><p class="text-[11px] font-bold text-ink-muted">ACTIVAS</p><p class="font-display text-2xl font-semibold text-straw">{{ stats.byStatus.ACTIVE }}</p></div>
        <div class="rounded-2xl border border-border bg-surface p-4"><p class="text-[11px] font-bold text-ink-muted">HECHAS</p><p class="font-display text-2xl font-semibold">{{ stats.byStatus.DONE }}</p></div>
      </div>
      <p *ngIf="error" class="mt-4 text-red-700">{{ error }}</p>
      <p *ngIf="!loading && !items.length" class="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-ink-muted">
        No hay tareas todavía.
        <a *ngIf="user?.role==='FARMER'" routerLink="/app/tasks/new" class="mt-2 block font-semibold text-primary">Crear la primera →</a>
      </p>
      <ul class="mt-8 space-y-3">
        <li *ngFor="let t of items">
          <a [routerLink]="['/app/tasks', t.id]" class="block rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary/40">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p class="text-xs font-bold tracking-wide text-straw">{{ t.code }} · {{ t.parcel?.name }}</p>
                <h2 class="mt-1 text-lg font-semibold">{{ t.title }}</h2>
                <p class="mt-1 text-sm text-ink-muted">{{ t.parcel?.crop }} · {{ t.parcel?.hectares }} ha</p>
                <p class="mt-2 text-xs text-ink-muted">Vence {{ t.dueAt | date:'short' }}
                  <span *ngIf="user?.role==='FARMER' && t.technician"> · {{ t.technician?.name }}</span>
                  <span *ngIf="user?.role==='TECHNICIAN'"> · {{ t.farmer?.name }}</span>
                </p>
              </div>
              <span class="rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase text-primary">{{ label(t.status) }}</span>
            </div>
          </a>
        </li>
      </ul>
    </main>
  </div>
  `,
})
export class TasksPage implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  items: FieldTask[] = []; stats: TaskStats | null = null; user: User | null = null; loading = true; error = '';
  ngOnInit() {
    this.user = this.api.getUser();
    if (!this.api.getToken()) { this.router.navigate(['/login']); return; }
    this.api.listTasks().subscribe({
      next: (c) => { this.items = c; this.loading = false; },
      error: () => { this.error = 'No se pudieron cargar las tareas.'; this.loading = false; },
    });
    this.api.stats().subscribe({ next: (s) => (this.stats = s) });
  }
  label(s: string) {
    return ({ PENDING: 'Pendiente', ACTIVE: 'Activa', DONE: 'Hecha', CANCELLED: 'Cancelada' } as Record<string,string>)[s] ?? s;
  }
  logout() { this.api.logout(); this.router.navigate(['/login']); }
}
