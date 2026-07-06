import { Routes } from '@angular/router';
import { Accueil } from './pages/accueil/accueil';
import { Login } from './pages/login/login';
import { Inscription } from './pages/inscription/inscription';
import { ClientDashboard } from './pages/client-dashboard/client-dashboard';
import { AgentDashboard } from './pages/agent-dashboard/agent-dashboard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: Accueil },
  { path: 'connexion', component: Login },
  { path: 'inscription', component: Inscription },
  { path: 'client', component: ClientDashboard },
  { path: 'agent', component: AgentDashboard },
  { path: 'admin', component: AdminDashboard },
];
