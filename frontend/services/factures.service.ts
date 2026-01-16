// services/factures.service.ts
import { apiService, ApiResponse } from './api.service';
import { offlineService } from './offline.service';

export interface FactureItem {
  id?: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
  taux_tva?: number;
  montant_ht?: number;
}

export interface Facture {
  id?: string;
  client_id: string;
  date_emission: string;
  date_echeance?: string;
  statut: 'brouillon' | 'validee' | 'payee' | 'annulee';
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  numero_facture: string;
  items: FactureItem[];
  created_at?: string;
  updated_at?: string;
}

export interface FactureOffline extends Facture {
  _sync_pending?: boolean;
  _deleted?: boolean;
  _updated_at?: string;
}

export interface FactureCreateDTO {
  client_id: string;
  date_emission: string;
  date_echeance?: string;
  items: FactureItem[];
}

// Fonction utilitaire pour calculer les montants
function calculerMontants(items: FactureItem[]): {
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
} {
  const ht = items.reduce((total, item) => {
    return total + (item.quantite * item.prix_unitaire);
  }, 0);

  const tva = ht * 0.2; // TVA à 20%
  const ttc = ht + tva;

  return {
    montant_ht: parseFloat(ht.toFixed(2)),
    montant_tva: parseFloat(tva.toFixed(2)),
    montant_ttc: parseFloat(ttc.toFixed(2)),
  };
}

// Fonction pour générer un numéro de facture
function genererNumeroFacture(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `FACT-${year}${month}${day}-${random}`;
}

export const facturesApiService = {
  async getAll(): Promise<Facture[]> {
    try {
      const response: ApiResponse<Facture[]> = await apiService.get('/factures');
      const factures = response.data;
      
      // Mettre à jour le cache local
      if (factures.length > 0) {
        await offlineService.saveFactures(factures);
      }
      
      return factures;
    } catch (error) {
      console.error('Erreur réseau, chargement depuis IndexedDB:', error);
      return await offlineService.getFactures();
    }
  },

  async getOne(id: string): Promise<Facture | null> {
    try {
      const response: ApiResponse<Facture> = await apiService.get(`/factures/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur réseau, chargement depuis IndexedDB:', error);
      return await offlineService.getFacture(id);
    }
  },

  async create(data: FactureCreateDTO): Promise<Facture> {
    // Calculer les montants
    const montants = calculerMontants(data.items);
    
    const factureData: Facture = {
      ...data,
      ...montants,
      numero_facture: genererNumeroFacture(),
      statut: 'brouillon',
      created_at: new Date().toISOString(),
      montant_ht: montants.montant_ht,
      montant_tva: montants.montant_tva,
      montant_ttc: montants.montant_ttc,
    };

    if (navigator.onLine) {
      try {
        const response: ApiResponse<Facture> = await apiService.post('/factures', factureData);
        const createdFacture = response.data;
        
        // Sauvegarder en local aussi
        await offlineService.saveFacture(createdFacture);
        
        return createdFacture;
      } catch (error) {
        console.error('Erreur API, fallback offline:', error);
        return await this.createOffline(factureData);
      }
    } else {
      console.log('Mode offline - sauvegarde locale');
      return await this.createOffline(factureData);
    }
  },

  async createOffline(data: Facture): Promise<Facture> {
    const tempFacture: FactureOffline = {
      ...data,
      id: `temp-${Date.now()}`,
      numero_facture: 'OFFLINE-' + Date.now(),
      _sync_pending: true,
    };

    await offlineService.saveFacture(tempFacture);
    console.log('Facture sauvegardée offline:', tempFacture);
    return tempFacture;
  },

  async update(id: string, data: Partial<Facture>): Promise<Facture> {
    try {
      const response: ApiResponse<Facture> = await apiService.put(`/factures/${id}`, data);
      const updatedFacture = response.data;
      
      // Mettre à jour localement
      await offlineService.saveFacture(updatedFacture);
      
      return updatedFacture;
    } catch (error) {
      console.error('Erreur mise à jour, sauvegarde offline:', error);
      
      // Mettre à jour en local avec flag de synchronisation
      const offlineData: FactureOffline = {
        ...(await offlineService.getFacture(id)) as FactureOffline,
        ...data,
        _sync_pending: true,
        _updated_at: new Date().toISOString(),
      };
      
      await offlineService.saveFacture(offlineData);
      return offlineData;
    }
  },

  async valider(id: string): Promise<Facture> {
    try {
      const response: ApiResponse<Facture> = await apiService.patch(`/factures/${id}/valider`, {});
      const validatedFacture = response.data;
      
      await offlineService.saveFacture(validatedFacture);
      return validatedFacture;
    } catch (error) {
      console.error('Erreur validation, mise à jour locale:', error);
      
      const facture = await offlineService.getFacture(id);
      if (facture) {
        const updatedFacture: FactureOffline = {
          ...facture,
          statut: 'validee',
          _sync_pending: true,
        };
        await offlineService.saveFacture(updatedFacture);
        return updatedFacture;
      }
      throw error;
    }
  },

  async payer(id: string): Promise<Facture> {
    try {
      const response: ApiResponse<Facture> = await apiService.patch(`/factures/${id}/payer`, {});
      const paidFacture = response.data;
      
      await offlineService.saveFacture(paidFacture);
      return paidFacture;
    } catch (error) {
      console.error('Erreur paiement, mise à jour locale:', error);
      
      const facture = await offlineService.getFacture(id);
      if (facture) {
        const updatedFacture: FactureOffline = {
          ...facture,
          statut: 'payee',
          _sync_pending: true,
        };
        await offlineService.saveFacture(updatedFacture);
        return updatedFacture;
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`/factures/${id}`);
      await offlineService.deleteFacture(id);
    } catch (error) {
      console.error('Erreur suppression, marquer comme supprimé localement:', error);
      // Marquer comme supprimé en local
      await offlineService.markAsDeleted(id);
    }
  },
};