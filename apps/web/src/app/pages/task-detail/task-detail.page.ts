import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, FieldTask, TaskStatus, User } from '../../core/api.service';
@Component({
  standalone: true, imports: [NgIf, NgFor, DatePipe, RouterLink],
  template: `
  <div class="min-h-screen" *ngIf="task">
    <header class="border-b border-border bg-surface">
      <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <a routerLink="/app/tasks" class="text-sm text-ink-muted">← Tareas</a>
        <span class="font-display font-semibold text-primary">{{ task.code }}</span>
        <span class="text-sm text-ink-muted">{{ user?.role }}</span>
      </div>
    </header>
    <main class="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-[1fr_280px]">
      <section class="rounded-2xl border border-border bg-surface p-6">
        <span class="rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase text-primary">{{ label(task.status) }}</span>
        <h1 class="mt-4 font-display text-3xl font-semibold">{{ task.title }}</h1>
        <p class="mt-2 text-lg">{{ task.parcel?.name }} · {{ task.parcel?.crop }}</p>
        <p class="mt-3 text-ink-muted">{{ task.parcel?.hectares }} ha · vence {{ task.dueAt | date:'medium' }}</p>
        <p class="mt-4 text-sm" *ngIf="task.notes"><span class="font-semibold">Notas:</span> {{ task.notes }}</p>
        <p class="mt-6 text-sm text-ink-muted" *ngIf="task.technician">Técnico: {{ task.technician?.name }}</p>
        <p class="text-sm text-ink-muted" *ngIf="task.farmer">Agricultor: {{ task.farmer?.name }}</p>
      </section>
      <aside class="rounded-2xl border border-border bg-surface p-5">
        <p class="text-xs font-bold tracking-wide text-ink-muted">CAMBIAR ESTADO</p>
        <div class="mt-3 flex flex-col gap-2">
          <button *ngFor="let st of allowed" type="button" (click)="setStatus(st)"
            class="rounded-xl px-3 py-2.5 text-left text-sm font-semibold"
            [class.bg-primary]="task.status===st" [class.text-white]="task.status===st"
            [class.bg-bg]="task.status!==st">{{ label(st) }}</button>
        </div>
        <p *ngIf="msg" class="mt-3 text-sm text-green-800">{{ msg }}</p>
        <p *ngIf="error" class="mt-3 text-sm text-red-700">{{ error }}</p>
      </aside>
    </main>
  </div>
  `,
})
export class TaskDetailPage implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  task: FieldTask | null = null; user: User | null = null; msg = ''; error = '';
  allowed: TaskStatus[] = [];
  ngOnInit() {
    this.user = this.api.getUser();
    if (!this.api.getToken()) { this.router.navigate(['/login']); return; }
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getTask(id).subscribe({
      next: (t) => {
        this.task = t;
        this.allowed = this.user?.role === 'TECHNICIAN'
          ? ['ACTIVE', 'DONE', 'CANCELLED']
          : ['PENDING', 'ACTIVE', 'DONE', 'CANCELLED'];
      },
      error: () => this.router.navigate(['/app/tasks']),
    });
  }
  label(s: string) {
    return ({ PENDING: 'Pendiente', ACTIVE: 'Activa', DONE: 'Hecha', CANCELLED: 'Cancelada' } as Record<string,string>)[s] ?? s;
  }
  setStatus(status: TaskStatus) {
    if (!this.task) return;
    this.api.updateStatus(this.task.id, status).subscribe({
      next: (t) => { this.task = t; this.msg = 'Estado actualizado'; this.error = ''; },
      error: () => { this.error = 'No se pudo actualizar'; this.msg = ''; },
    });
  }
}
