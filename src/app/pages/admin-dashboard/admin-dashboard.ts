import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { Admin as AdminService } from '../../services/admin';
import { Utilisateur } from '../../models/askia';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  utilisateur: Utilisateur | null = null;
  utilisateurs: Utilisateur[] = [];
  statistiques = {
    total_clients: 0,
    total_agents: 0,
    total_contrats: 0,
    contrats_par_type: [] as { type: string; total: number }[],
  };
  chargement = true;
  messageErreur = '';
  messageSucces = '';

  afficherFormAgent = false;
  nouvelAgent = {
    nom: '',
    email: '',
    mot_de_passe: '',
    matricule: '',
    departement: '',
  };

  utilisateurEnEdition: Utilisateur | null = null;
  edition = { nom: '', email: '' };

  constructor(
    private authService: Auth,
    private adminService: AdminService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.utilisateur = this.authService.getUtilisateur();
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;

    this.adminService.getStatistiques().subscribe({
      next: (stats) => {
        this.statistiques = stats;
        this.chargement = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.messageErreur = 'Impossible de charger les statistiques.';
        this.cd.detectChanges();
      },
    });

    this.adminService.getUtilisateurs().subscribe({
      next: (utilisateurs) => {
        this.utilisateurs = utilisateurs;
        this.cd.detectChanges();
      },
    });
  }

  creerAgent(): void {
    this.messageErreur = '';
    this.messageSucces = '';

    this.adminService.creerAgent(this.nouvelAgent).subscribe({
      next: () => {
        this.afficherFormAgent = false;
        this.nouvelAgent = { nom: '', email: '', mot_de_passe: '', matricule: '', departement: '' };
        this.afficherMessageSucces('Agent créé avec succès.');
        this.chargerDonnees();
      },
      error: () => {
        this.messageErreur = "Erreur lors de la création de l'agent.";
        this.cd.detectChanges();
      },
    });
  }

  commencerEdition(u: Utilisateur): void {
    this.utilisateurEnEdition = u;
    this.edition = { nom: u.nom, email: u.email };
  }

  annulerEdition(): void {
    this.utilisateurEnEdition = null;
  }

  enregistrerModification(): void {
    if (!this.utilisateurEnEdition) return;

    this.adminService.modifierUtilisateur(this.utilisateurEnEdition.id, this.edition).subscribe({
      next: () => {
        this.utilisateurEnEdition = null;
        this.afficherMessageSucces('Utilisateur modifié avec succès.');
        this.chargerDonnees();
      },
      error: () => {
        this.messageErreur = 'Erreur lors de la modification.';
        this.cd.detectChanges();
      },
    });
  }

  supprimerUtilisateur(u: Utilisateur): void {
    const confirmation = confirm(`Voulez-vous vraiment supprimer ${u.nom} ?`);
    if (!confirmation) return;

    this.adminService.supprimerUtilisateur(u.id).subscribe({
      next: () => {
        this.afficherMessageSucces('Utilisateur supprimé avec succès.');
        this.chargerDonnees();
      },
      error: () => {
        this.messageErreur = 'Erreur lors de la suppression.';
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
