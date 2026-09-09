import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './componentes/home/home';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  { path: 'dashboard', component: Dashboard },
];

