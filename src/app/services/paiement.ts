import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Paiement as PaiementModel } from '../models/askia';

@Injectable({
  providedIn: 'root',
})
export class Paiement {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Liste des paiements du client connecté
  getPaiements(): Observable<PaiementModel[]> {
    return this.http.get<PaiementModel[]>(`${this.apiUrl}/paiements`);
  }

  // Démarre un paiement via PayTech (Wave ou Orange Money)
  effectuer(contratId: number, moyen: 'wave' | 'orange_money'): Observable<{ paiement: PaiementModel; redirection: any }> {
    return this.http.post<{ paiement: PaiementModel; redirection: any }>(`${this.apiUrl}/paiements/effectuer`, {
      contrat_id: contratId,
      moyen,
    });
  }

  // Vérifie le statut d'un paiement après retour de PayTech
  verifierStatut(paiementId: number): Observable<PaiementModel> {
    return this.http.get<PaiementModel>(`${this.apiUrl}/paiements/${paiementId}`);
  }
}
