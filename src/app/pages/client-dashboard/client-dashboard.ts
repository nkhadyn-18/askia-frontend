import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { Contrat as ContratService } from '../../services/contrat';
import { Sinistre as SinistreService } from '../../services/sinistre';
import { Paiement as PaiementService } from '../../services/paiement';
import { Contrat, Sinistre, Paiement, Utilisateur } from '../../models/askia';

@Component({
  selector: 'app-client-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.css',
})
export class ClientDashboard implements OnInit {
  utilisateur: Utilisateur | null = null;
  contrats: Contrat[] = [];
  sinistres: Sinistre[] = [];
  paiements: Paiement[] = [];
  chargement = true;
  messageErreur = '';
  messageSucces = '';

  afficherNotifications = false;

  tarifsBase: { [key: string]: number } = {
    automobile: 75000,
    habitation: 45000,
    sante: 60000,
  };

  afficherFormSouscription = false;
  nouveauContrat = {
    type: 'automobile',
    date_debut: '',
    date_fin: '',
    montant: 75000,
  };

  afficherFormSinistre = false;
  nouveauSinistre = {
    contrat_id: 0,
    description: '',
    date: '',
  };
  fichierSinistre: File | null = null;

  constructor(
    private authService: Auth,
    private contratService: ContratService,
    private sinistreService: SinistreService,
    private paiementService: PaiementService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.utilisateur = this.authService.getUtilisateur();
    this.chargerDonnees();
  }

  get notifications(): string[] {
    const notifs: string[] = [];

    this.sinistres.forEach((s) => {
      if (s.statut === 'traite') {
        notifs.push(`Votre sinistre "${s.description}" a été traité.`);
      } else if (s.statut === 'refuse') {
        notifs.push(`Votre sinistre "${s.description}" a été refusé.`);
      }
    });

    this.contrats.forEach((c) => {
      const finContrat = new Date(c.date_fin);
      const aujourdHui = new Date();
      const joursRestants = Math.ceil((finContrat.getTime() - aujourdHui.getTime()) / (1000 * 3600 * 24));
      if (joursRestants > 0 && joursRestants <= 30) {
        notifs.push(`Votre contrat ${c.type} expire dans ${joursRestants} jour(s). Pensez à le renouveler.`);
      }
    });

    return notifs;
  }

  calculerDevis(): void {
    this.nouveauContrat.montant = this.tarifsBase[this.nouveauContrat.type] || 0;
  }

  chargerDonnees(): void {
    this.chargement = true;

    this.contratService.getContrats().subscribe({
      next: (contrats) => {
        this.contrats = contrats;
        this.chargement = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.messageErreur = 'Impossible de charger vos contrats.';
        this.cd.detectChanges();
      },
    });

    this.sinistreService.getSinistres().subscribe({
      next: (sinistres) => {
        this.sinistres = sinistres;
        this.cd.detectChanges();
      },
    });

    this.paiementService.getPaiements().subscribe({
      next: (paiements) => {
        this.paiements = paiements;
        this.cd.detectChanges();
      },
    });
  }

  souscrire(): void {
    this.messageErreur = '';
    this.messageSucces = '';
    this.contratService.souscrire(this.nouveauContrat).subscribe({
      next: () => {
        this.afficherFormSouscription = false;
        this.nouveauContrat = { type: 'automobile', date_debut: '', date_fin: '', montant: 75000 };
        this.afficherMessageSucces('Souscription effectuée avec succès.');
        this.chargerDonnees();
      },
      error: () => {
        this.messageErreur = 'Erreur lors de la souscription.';
        this.cd.detectChanges();
      },
    });
  }

  onFichierSelectionne(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fichierSinistre = input.files[0];
    }
  }

  declarerSinistre(): void {
    this.messageErreur = '';
    this.messageSucces = '';
    this.sinistreService.declarer(this.nouveauSinistre, this.fichierSinistre || undefined).subscribe({
      next: () => {
        this.afficherFormSinistre = false;
        this.nouveauSinistre = { contrat_id: 0, description: '', date: '' };
        this.fichierSinistre = null;
        this.afficherMessageSucces('Sinistre déclaré avec succès.');
        this.chargerDonnees();
      },
      error: () => {
        this.messageErreur = 'Erreur lors de la déclaration.';
        this.cd.detectChanges();
      },
    });
  }

  payer(contratId: number, moyen: 'wave' | 'orange_money'): void {
    this.messageErreur = '';
    this.messageSucces = '';
    this.paiementService.effectuer(contratId, moyen).subscribe({
      next: () => {
        this.afficherMessageSucces('Paiement effectué avec succès.');
        this.chargerDonnees();
      },
      error: () => {
        this.messageErreur = 'Erreur lors du paiement.';
        this.cd.detectChanges();
      },
    });
  }

  renouveler(contratId: number): void {
    this.messageErreur = '';
    this.messageSucces = '';
    this.contratService.renouveler(contratId).subscribe({
      next: () => {
        this.afficherMessageSucces('Contrat renouvelé avec succès.');
        this.chargerDonnees();
      },
      error: () => {
        this.messageErreur = 'Erreur lors du renouvellement.';
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
