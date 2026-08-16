import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true, imports: [RouterLink],
  template: `
  <header class="border-b border-border bg-surface/95">
    <div class="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
      <a routerLink="/" class="font-display text-2xl font-semibold text-primary tracking-tight">SURCO</a>
      <div class="flex items-center gap-4">
        <a routerLink="/login" class="text-sm font-semibold text-ink-muted hover:text-ink">Entrar</a>
        <a routerLink="/login" class="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-strong">Abrir cuaderno</a>
      </div>
    </div>
  </header>
  <div class="w-full">
    <img src="assets/hero.jpg" alt="Parcelas agrícolas al atardecer" class="h-[46vh] min-h-[280px] w-full object-cover" />
  </div>
  <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <p class="text-xs font-bold tracking-[0.14em] text-straw">AGRO · EXPLOTACIÓN FAMILIAR</p>
    <h1 class="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.08] md:text-6xl">El campo, al día.</h1>
    <p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">Cuaderno digital de parcelas y tareas. El agricultor planifica; el técnico de campo actualiza estado. Sin papeles mojados en la cabina.</p>
    <div class="mt-8 flex flex-wrap gap-3">
      <a routerLink="/login" class="rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white">Soy agricultor</a>
      <a routerLink="/login" class="rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold">Soy técnico</a>
    </div>
  </section>
  <section class="border-y border-border bg-primary-soft/50">
    <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 class="font-display text-3xl font-semibold">Cómo funciona</h2>
      <div class="mt-8 grid gap-4 md:grid-cols-3">
        <article class="rounded-2xl border border-border bg-surface p-6"><p class="text-xs font-bold text-straw">01</p><h3 class="mt-2 font-semibold">Defines la parcela</h3><p class="mt-2 text-sm text-ink-muted">Cultivo, hectáreas y nombre del bancal.</p></article>
        <article class="rounded-2xl border border-border bg-surface p-6"><p class="text-xs font-bold text-straw">02</p><h3 class="mt-2 font-semibold">Creas la tarea</h3><p class="mt-2 text-sm text-ink-muted">Riego, poda, muestreo. Opcional: asigna técnico.</p></article>
        <article class="rounded-2xl border border-border bg-surface p-6"><p class="text-xs font-bold text-straw">03</p><h3 class="mt-2 font-semibold">Se cierra en campo</h3><p class="mt-2 text-sm text-ink-muted">ACTIVE → DONE. El cuaderno queda al día.</p></article>
      </div>
    </div>
  </section>
  <footer class="bg-primary text-white"><div class="mx-auto max-w-6xl px-4 py-10 sm:px-6"><p class="font-display text-xl">SURCO</p><p class="mt-2 text-sm text-white/70">Demo: campo&#64;surco.agro / tecnico&#64;surco.agro · password123</p></div></footer>
  `,
})
export class HomePage {}
