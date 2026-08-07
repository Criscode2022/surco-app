import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../../core/api.service';
@Component({
  standalone: true, imports: [ReactiveFormsModule, NgIf, RouterLink],
  template: `
  <div class="min-h-screen">
    <header class="border-b border-border bg-surface">
      <div class="mx-auto flex h-16 max-w-xl items-center justify-between px-4">
        <a routerLink="/app/tasks" class="text-sm text-ink-muted">← Tareas</a>
        <span class="font-display font-semibold text-primary">Nueva tarea</span>
        <span></span>
      </div>
    </header>
    <main class="mx-auto max-w-xl px-4 py-10">
      <form class="space-y-4 rounded-2xl border border-border bg-surface p-6" [formGroup]="form" (ngSubmit)="submit()">
        <div>
          <label class="mb-1 block text-sm font-semibold">Título</label>
          <input formControlName="title" class="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm" placeholder="Riego sector A" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold">Parcela</label>
          <input formControlName="parcelName" class="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm" placeholder="Bancal Nord" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold">Cultivo</label>
          <input formControlName="crop" class="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm" placeholder="Olivo" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold">Vence</label>
          <input formControlName="dueAt" type="datetime-local" class="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold">Notas</label>
          <textarea formControlName="notes" rows="3" class="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm"></textarea>
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold">Email técnico (opcional)</label>
          <input formControlName="technicianEmail" class="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm" placeholder="tecnico@surco.agro" />
        </div>
        <p *ngIf="error" class="text-sm text-red-700">{{ error }}</p>
        <button type="submit" [disabled]="form.invalid || loading" class="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white disabled:opacity-50">Crear tarea</button>
      </form>
    </main>
  </div>
  `,
})
export class TaskNewPage {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  loading = false; error = '';
  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    parcelName: ['Bancal Nord', [Validators.required]],
    crop: ['Olivo'],
    dueAt: ['', Validators.required],
    notes: [''],
    technicianEmail: [''],
  });
  submit() {
    this.loading = true; this.error = '';
    const v = this.form.getRawValue();
    this.api.createTask({
      title: v.title,
      parcelName: v.parcelName,
      crop: v.crop || undefined,
      dueAt: new Date(v.dueAt).toISOString(),
      notes: v.notes || undefined,
      technicianEmail: v.technicianEmail || undefined,
    }).subscribe({
      next: (t) => { this.loading = false; this.router.navigate(['/app/tasks', t.id]); },
      error: () => { this.loading = false; this.error = 'No se pudo crear (¿email técnico válido?)'; },
    });
  }
}
