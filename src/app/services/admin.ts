import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Utilisateur } from '../models/askia';

interface Statistiques {
  total_clients: number;
  total_agents: number;
  total_contrats: number;
  contrats_par_type: { type: string; total: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class Admin {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Liste de tous les utilisateurs
  getUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/admin/utilisateurs`);
  }

  // Statistiques globales de la plateforme
  getStatistiques(): Observable<Statistiques> {
    return this.http.get<Statistiques>(`${this.apiUrl}/admin/statistiques`);
  }

  // Création d'un nouveau compte agent
  creerAgent(donnees: {
    nom: string;
    email: string;
    mot_de_passe: string;
    matricule: string;
    departement: string;
  }): Observable<{ user: Utilisateur; agent: any }> {
    return this.http.post<{ user: Utilisateur; agent: any }>(`${this.apiUrl}/admin/agents`, donnees);
  }

  // Modification d'un utilisateur
  modifierUtilisateur(id: number, donnees: { nom: string; email: string }): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/admin/utilisateurs/${id}`, donnees);
  }

  // Suppression d'un utilisateur
  supprimerUtilisateur(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/utilisateurs/${id}`);
  }
}
