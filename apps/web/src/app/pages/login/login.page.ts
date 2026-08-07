import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../../core/api.service';
@Component({
  standalone: true, imports: [ReactiveFormsModule, NgIf, RouterLink],
  template: `
  <div class="grid min-h-screen md:grid-cols-2">
    <div class="hidden flex-col justify-between bg-primary p-10 text-white md:flex">
      <a routerLink="/" class="font-display text-2xl font-semibold">SURCO</a>
      <div>
        <p class="text-xs font-bold tracking-[0.14em] text-straw">JWT MULTI-ROL</p>
        <h1 class="mt-3 font-display text-4xl font-semibold leading-tight">Agricultor planifica. Técnico ejecuta.</h1>
        <p class="mt-4 text-sm text-white/70">Tareas de parcela con estado vivo.</p>
      </div>
      <p class="text-xs text-white/50">password123 · demo 2026-08-07</p>
    </div>
    <div class="flex flex-col justify-center px-6 py-12">
      <a routerLink="/" class="font-display text-2xl font-semibold text-primary md:hidden">SURCO</a>
      <h1 class="mt-6 font-display text-3xl font-semibold">Iniciar sesión</h1>
      <p class="mt-2 text-sm text-ink-muted">FARMER o TECHNICIAN</p>
      <form class="mt-8 space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm" [formGroup]="form" (ngSubmit)="submit()">
        <div>
          <label class="mb-1 block text-sm font-semibold" for="em">Email</label>
          <input id="em" type="email" formControlName="email" class="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold" for="pw">Contraseña</label>
          <input id="pw" type="password" formControlName="password" class="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <p *ngIf="error" class="text-sm text-red-700">{{ error }}</p>
        <button type="submit" [disabled]="form.invalid || loading" class="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white disabled:opacity-50">Entrar al cuaderno</button>
        <p class="text-center text-xs text-ink-muted">campo&#64;surco.agro · tecnico&#64;surco.agro · password123</p>
      </form>
    </div>
  </div>
  `,
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  loading = false; error = '';
  form = this.fb.nonNullable.group({
    email: ['campo@surco.agro', [Validators.required, Validators.email]],
    password: ['password123', Validators.required],
  });
  submit() {
    this.loading = true; this.error = '';
    const v = this.form.getRawValue();
    this.api.login(v.email, v.password).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/app/tasks']); },
      error: () => { this.loading = false; this.error = 'Credenciales inválidas'; },
    });
  }
}
