
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './componentes/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './auth/auth-guard';


export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full' },
    {path: 'login', component: Login},
    {path: 'home', component: Home, canActivate: [authGuard] },
    {path: 'dashboard', component: Dashboard, canActivate: [authGuard] },


];