// services/offline.service.ts
import Dexie, { Table } from 'dexie';
import { Facture, FactureOffline } from './factures.service';

class OfflineDatabase extends Dexie {
  factures!: Table<FactureOffline>;

  constructor() {
    super('ERPFacturationDB');
    this.version(1).stores({
      factures: '++id, client_id, numero_facture, statut, _sync_pending, _deleted'
    });
  }
}

export const db = new OfflineDatabase();

export const offlineService = {
  async saveFactures(factures: Facture[]): Promise<void> {
    try {
      const offlineFactures: FactureOffline[] = factures.map(facture => ({
        ...facture,
        _sync_pending: false,
        _deleted: false,
      }));
      
      await db.factures.bulkPut(offlineFactures);
    } catch (error) {
      console.error('Erreur sauvegarde factures offline:', error);
      throw error;
    }
  },

  async saveFacture(facture: FactureOffline): Promise<string> {
    try {
      const id = await db.factures.put(facture);
      return id.toString();
    } catch (error) {
      console.error('Erreur sauvegarde facture offline:', error);
      throw error;
    }
  },

  async getFactures(): Promise<Facture[]> {
    try {
      const factures = await db.factures
        .where('_deleted')
        .notEqual(1)
        .toArray();
      
      // Retirer les propriétés offline avant de retourner
      return factures.map(({ _sync_pending, _deleted, _updated_at, ...facture }) => facture);
    } catch (error) {
      console.error('Erreur récupération factures offline:', error);
      return [];
    }
  },

  async getFacture(id: string): Promise<FactureOffline | null> {
    try {
      const facture = await db.factures.get(id);
      
      if (!facture || facture._deleted) {
        return null;
      }
      
      return facture;
    } catch (error) {
      console.error('Erreur récupération facture offline:', error);
      return null;
    }
  },

  async getFactureOnline(id: string): Promise<Facture | null> {
    try {
      const facture = await db.factures.get(id);
      
      if (!facture || facture._deleted) {
        return null;
      }
      
      // Retirer les propriétés offline
      const { _sync_pending, _deleted, _updated_at, ...onlineFacture } = facture;
      return onlineFacture;
    } catch (error) {
      console.error('Erreur récupération facture offline:', error);
      return null;
    }
  },

  async getPendingSync(): Promise<FactureOffline[]> {
    try {
      return await db.factures
        .where('_sync_pending')
        .equals(1)
        .and(f => !f._deleted)
        .toArray();
    } catch (error) {
      console.error('Erreur récupération pending sync:', error);
      return [];
    }
  },

  async markAsSynced(id: string): Promise<void> {
    try {
      await db.factures.update(id, { _sync_pending: false });
    } catch (error) {
      console.error('Erreur marquage comme synchronisé:', error);
    }
  },

  async markAsDeleted(id: string): Promise<void> {
    try {
      await db.factures.update(id, { _deleted: true, _sync_pending: true });
    } catch (error) {
      console.error('Erreur marquage comme supprimé:', error);
    }
  },

  async deleteFacture(id: string): Promise<void> {
    try {
      await db.factures.delete(id);
    } catch (error) {
      console.error('Erreur suppression facture offline:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await db.factures.clear();
    } catch (error) {
      console.error('Erreur nettoyage base offline:', error);
    }
  },
};