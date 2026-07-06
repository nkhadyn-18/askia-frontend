import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Client, Sinistre } from '../models/askia';

@Injectable({
  providedIn: 'root',
})
export class Agent {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Liste de tous les clients de la plateforme
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/agent/clients`);
  }

  // Liste des sinistres à traiter (en attente ou en cours)
  getSinistresATraiter(): Observable<Sinistre[]> {
    return this.http.get<Sinistre[]>(`${this.apiUrl}/agent/sinistres`);
  }
}
