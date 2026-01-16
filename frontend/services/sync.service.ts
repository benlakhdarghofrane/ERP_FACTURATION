// services/sync.service.ts - Version simplifiée
import { apiService, ApiResponse } from './api.service';
import { offlineService } from './offline.service';
import { Facture, FactureOffline } from './factures.service';

// Fonction utilitaire pour convertir FactureOffline en Facture (sans propriétés offline)
function convertToFacture(item: FactureOffline): Facture {
  return {
    id: item.id,
    client_id: item.client_id,
    date_emission: item.date_emission,
    date_echeance: item.date_echeance,
    statut: item.statut,
    montant_ht: item.montant_ht,
    montant_tva: item.montant_tva,
    montant_ttc: item.montant_ttc,
    numero_facture: item.numero_facture,
    items: item.items,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

export const syncService = {
  async syncAll(): Promise<{ success: boolean; message: string }> {
    if (!navigator.onLine) {
      return {
        success: false,
        message: 'Pas de connexion Internet. Synchronisation impossible.'
      };
    }

    try {
      console.log('Début de la synchronisation...');
      
      const pendingItems = await offlineService.getPendingSync();
      
      if (pendingItems.length === 0) {
        return {
          success: true,
          message: 'Aucune donnée à synchroniser.'
        };
      }
      
      console.log(`${pendingItems.length} élément(s) à synchroniser`);
      let successful = 0;
      let failed = 0;

      // Traiter les éléments un par un (au lieu de Promise.allSettled)
      for (const item of pendingItems) {
        try {
          const factureData = convertToFacture(item);

          if (item._deleted && item.id) {
            // Suppression
            if (!item.id.startsWith('temp-')) {
              await apiService.delete(`/factures/${item.id}`);
            }
            await offlineService.deleteFacture(item.id);
            successful++;
          } else if (item.id && item.id.startsWith('temp-')) {
            // Création
            const response: ApiResponse<Facture> = await apiService.post('/factures', factureData);
            
            await offlineService.deleteFacture(item.id);
            
            const savedFacture: FactureOffline = {
              ...response.data,
              _sync_pending: false,
              _deleted: false,
            };
            
            await offlineService.saveFacture(savedFacture);
            successful++;
          } else if (item.id) {
            // Mise à jour
            await apiService.put(`/factures/${item.id}`, factureData);
            await offlineService.markAsSynced(item.id);
            successful++;
          }
        } catch (error) {
          console.error(`Erreur synchronisation ${item.id}:`, error);
          failed++;
        }
      }

      // Synchroniser depuis le serveur
      try {
        const response: ApiResponse<Facture[]> = await apiService.get('/factures');
        await offlineService.saveFactures(response.data);
      } catch (error) {
        console.error('Erreur récupération données serveur:', error);
      }

      console.log(`Synchronisation terminée: ${successful} réussi(s), ${failed} échec(s)`);

      return {
        success: failed === 0,
        message: `Synchronisation terminée: ${successful} réussi(s), ${failed} échec(s)`
      };
      
    } catch (error) {
      console.error('Erreur générale de synchronisation:', error);
      return {
        success: false,
        message: 'Erreur lors de la synchronisation: ' + (error as Error).message
      };
    }
  },

  async checkConnection(): Promise<boolean> {
    return navigator.onLine;
  },

  async autoSync(): Promise<void> {
    if (await this.checkConnection()) {
      await this.syncAll();
    }
  },

  setupAutoSync(): void {
    if (typeof window === 'undefined') return;

    const syncHandler = () => {
      console.log('Connexion rétablie, lancement synchronisation...');
      this.autoSync();
    };

    window.addEventListener('online', syncHandler);

    // Nettoyage
    window.addEventListener('beforeunload', () => {
      window.removeEventListener('online', syncHandler);
    });

    // Synchronisation initiale
    setTimeout(() => {
      this.autoSync();
    }, 1000);
  },
};

// Démarrer la synchronisation automatique
if (typeof window !== 'undefined') {
  syncService.setupAutoSync();
}