import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Contrat as ContratModel } from '../models/askia';

@Injectable({
  providedIn: 'root',
})
export class Contrat {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Récupère la liste des contrats du client connecté
  getContrats(): Observable<ContratModel[]> {
    return this.http.get<ContratModel[]>(`${this.apiUrl}/contrats`);
  }

  // Envoie une nouvelle souscription
  souscrire(contrat: {
    type: string;
    date_debut: string;
    date_fin: string;
    montant: number;
  }): Observable<ContratModel> {
    return this.http.post<ContratModel>(`${this.apiUrl}/contrats`, contrat);
  }

  // Renouvelle un contrat existant
  renouveler(contratId: number): Observable<ContratModel> {
    return this.http.put<ContratModel>(`${this.apiUrl}/contrats/${contratId}/renouveler`, {});
  }
}
