export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: 'client' | 'agent' | 'administrateur';
}

export interface Client extends Utilisateur {
  telephone: string;
  adresse: string;
  user?: Utilisateur;
}

export interface Agent extends Utilisateur {
  matricule: string;
  departement: string;
}

export interface Contrat {
  id: number;
  client_id: number;
  type: 'automobile' | 'habitation' | 'sante';
  date_debut: string;
  date_fin: string;
  montant: number;
}

export interface Sinistre {
  id: number;
  client_id: number;
  agent_id: number | null;
  contrat_id: number;
  description: string;
  date: string;
  statut: 'en_attente' | 'en_cours' | 'traite' | 'refuse';
}

export interface Paiement {
  id: number;
  client_id: number;
  contrat_id: number;
  montant: number;
  date: string;
  moyen: 'wave' | 'orange_money';
  statut: 'en_attente' | 'confirme' | 'echoue';
}
