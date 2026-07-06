import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Utilisateur } from '../models/askia';

interface ReponseAuth {
  user: Utilisateur;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Inscription d'un nouveau client
  register(donnees: {
    nom: string;
    email: string;
    mot_de_passe: string;
    telephone: string;
    adresse: string;
  }): Observable<ReponseAuth> {
    return this.http.post<ReponseAuth>(`${this.apiUrl}/register`, donnees).pipe(
      tap((reponse) => this.enregistrerSession(reponse))
    );
  }

  // Connexion (client, agent ou administrateur)
  login(email: string, mot_de_passe: string): Observable<ReponseAuth> {
    return this.http
      .post<ReponseAuth>(`${this.apiUrl}/login`, { email, mot_de_passe })
      .pipe(tap((reponse) => this.enregistrerSession(reponse)));
  }

  // Déconnexion
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('utilisateur');
      })
    );
  }

  // Stocke le token et les infos utilisateur après connexion/inscription
  private enregistrerSession(reponse: ReponseAuth): void {
    localStorage.setItem('token', reponse.token);
    localStorage.setItem('utilisateur', JSON.stringify(reponse.user));
  }

  // Récupère le token stocké
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Récupère l'utilisateur connecté
  getUtilisateur(): Utilisateur | null {
    const donnees = localStorage.getItem('utilisateur');
    return donnees ? JSON.parse(donnees) : null;
  }

  // Vérifie si un utilisateur est connecté
  estConnecte(): boolean {
    return !!this.getToken();
  }
}
