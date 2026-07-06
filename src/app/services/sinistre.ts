import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sinistre as SinistreModel } from '../models/askia';

@Injectable({
  providedIn: 'root',
})
export class Sinistre {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Déclare un nouveau sinistre, avec document optionnel
  declarer(sinistre: {
    contrat_id: number;
    description: string;
    date: string;
  }, document?: File): Observable<SinistreModel> {
    const formData = new FormData();
    formData.append('contrat_id', String(sinistre.contrat_id));
    formData.append('description', sinistre.description);
    formData.append('date', sinistre.date);

    if (document) {
      formData.append('document', document);
    }

    return this.http.post<SinistreModel>(`${this.apiUrl}/sinistres`, formData);
  }

  // Suit l'état d'avancement des sinistres du client
  getSinistres(): Observable<SinistreModel[]> {
    return this.http.get<SinistreModel[]>(`${this.apiUrl}/sinistres`);
  }

  // Utilisé par l'agent pour lister les sinistres à traiter
  getSinistresATraiter(): Observable<SinistreModel[]> {
    return this.http.get<SinistreModel[]>(`${this.apiUrl}/agent/sinistres`);
  }

  // Utilisé par l'agent pour mettre à jour le statut
  mettreAJourStatut(sinistreId: number, statut: string): Observable<SinistreModel> {
    return this.http.put<SinistreModel>(`${this.apiUrl}/sinistres/${sinistreId}`, { statut });
  }
}
