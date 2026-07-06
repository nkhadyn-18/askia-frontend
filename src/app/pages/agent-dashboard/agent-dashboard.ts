import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { Agent as AgentService } from '../../services/agent';
import { Sinistre as SinistreService } from '../../services/sinistre';
import { Client, Sinistre, Utilisateur } from '../../models/askia';

@Component({
  selector: 'app-agent-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-dashboard.html',
  styleUrl: './agent-dashboard.css',
})
export class AgentDashboard implements OnInit {
  utilisateur: Utilisateur | null = null;
  clients: Client[] = [];
  sinistres: Sinistre[] = [];
  chargement = true;
  messageErreur = '';
  messageSucces = '';

  constructor(
    private authService: Auth,
    private agentService: AgentService,
    private sinistreService: SinistreService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.utilisateur = this.authService.getUtilisateur();
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;

    this.agentService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.chargement = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.messageErreur = 'Impossible de charger les clients.';
        this.cd.detectChanges();
      },
    });

    this.agentService.getSinistresATraiter().subscribe({
      next: (sinistres) => {
        this.sinistres = sinistres;
        this.cd.detectChanges();
      },
    });
  }

  traiterSinistre(sinistreId: number, statut: string): void {
    this.messageErreur = '';
    this.messageSucces = '';

    const libelles: any = { en_cours: 'marqué en cours', traite: 'marqué traité', refuse: 'refusé' };

    this.sinistreService.mettreAJourStatut(sinistreId, statut).subscribe({
      next: () => {
        this.afficherMessageSucces(`Sinistre ${libelles[statut]} avec succès.`);
        this.chargerDonnees();
      },
      error: () => {
        this.messageErreur = 'Erreur lors de la mise à jour du sinistre.';
        this.cd.detectChanges();
      },
    });
  }

  private afficherMessageSucces(message: string): void {
    this.messageSucces = message;
    this.cd.detectChanges();
    setTimeout(() => {
      this.messageSucces = '';
      this.cd.detectChanges();
    }, 4000);
  }

  seDeconnecter(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/connexion']),
      error: () => this.router.navigate(['/connexion']),
    });
  }
}
