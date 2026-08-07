import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
const API = 'http://localhost:3007/api';
const KEY = 'surco_token';
const USER = 'surco_user';
export type Role = 'FARMER' | 'TECHNICIAN';
export type TaskStatus = 'PENDING' | 'ACTIVE' | 'DONE' | 'CANCELLED';
export interface User { id: string; email: string; name: string; role: Role; }
export interface Parcel { id: string; name: string; crop: string; hectares: number; }
export interface FieldTask {
  id: string; code: string; title: string; notes: string; status: TaskStatus; dueAt: string;
  farmer?: { name: string; email: string }; technician?: { name: string; email: string } | null; parcel?: Parcel;
  createdAt: string; updatedAt: string;
}
export interface TaskStats { total: number; open: number; byStatus: Record<TaskStatus, number>; }
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  getToken() { return localStorage.getItem(KEY); }
  getUser(): User | null {
    const r = localStorage.getItem(USER);
    return r ? JSON.parse(r) : null;
  }
  logout() { localStorage.removeItem(KEY); localStorage.removeItem(USER); }
  private auth() {
    const t = this.getToken();
    return t ? { headers: new HttpHeaders({ Authorization: `Bearer ${t}` }) } : {};
  }
  login(email: string, password: string) {
    return this.http.post<{ accessToken: string; user: User }>(`${API}/auth/login`, { email, password }).pipe(
      tap((r) => {
        localStorage.setItem(KEY, r.accessToken);
        localStorage.setItem(USER, JSON.stringify(r.user));
      }),
    );
  }
  listTasks(): Observable<FieldTask[]> { return this.http.get<FieldTask[]>(`${API}/tasks`, this.auth()); }
  stats(): Observable<TaskStats> { return this.http.get<TaskStats>(`${API}/tasks/stats/summary`, this.auth()); }
  getTask(id: string): Observable<FieldTask> { return this.http.get<FieldTask>(`${API}/tasks/${id}`, this.auth()); }
  createTask(body: { title: string; parcelName: string; crop?: string; dueAt: string; notes?: string; technicianEmail?: string }) {
    return this.http.post<FieldTask>(`${API}/tasks`, body, this.auth());
  }
  updateStatus(id: string, status: TaskStatus) {
    return this.http.patch<FieldTask>(`${API}/tasks/${id}/status`, { status }, this.auth());
  }
}
