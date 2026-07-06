import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-inscription',
  imports: [FormsModule],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription {
  nom = '';
  email = '';
  motDePasse = '';
  telephone = '';
  adresse = '';
  erreur = '';
  chargement = false;

  constructor(private authService: Auth, private router: Router) {}

  sInscrire(): void {
    this.erreur = '';
    this.chargement = true;

    this.authService
      .register({
        nom: this.nom,
        email: this.email,
        mot_de_passe: this.motDePasse,
        telephone: this.telephone,
        adresse: this.adresse,
      })
      .subscribe({
        next: () => {
          this.chargement = false;
          this.router.navigate(['/client']);
        },
        error: (err) => {
          this.chargement = false;
          if (err.error?.errors) {
            const premiereErreur = Object.values(err.error.errors)[0] as string[];
            this.erreur = premiereErreur[0];
          } else {
            this.erreur = "Une erreur s'est produite. Veuillez réessayer.";
          }
        },
      });
  }
}
