import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { TasksPage } from './pages/tasks/tasks.page';
import { TaskDetailPage } from './pages/task-detail/task-detail.page';
import { TaskNewPage } from './pages/task-new/task-new.page';
export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'app/tasks', component: TasksPage },
  { path: 'app/tasks/new', component: TaskNewPage },
  { path: 'app/tasks/:id', component: TaskDetailPage },
  { path: '**', redirectTo: '' },
];
