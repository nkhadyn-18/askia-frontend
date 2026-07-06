import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  motDePasse = '';
  erreur = '';
  chargement = false;

  constructor(private authService: Auth, private router: Router) {}

  seConnecter(): void {
    this.erreur = '';
    this.chargement = true;

    this.authService.login(this.email, this.motDePasse).subscribe({
      next: (reponse) => {
        this.chargement = false;
        if (reponse.user.role === 'client') {
          this.router.navigate(['/client']);
        } else if (reponse.user.role === 'agent') {
          this.router.navigate(['/agent']);
        } else {
          this.router.navigate(['/admin']);
        }
      },
      error: () => {
        this.chargement = false;
        this.erreur = 'Email ou mot de passe incorrect.';
      },
    });
  }
}
