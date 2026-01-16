// Dans votre composant, corrigez l'import et l'utilisation
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { facturesApiService } from '../../../services/factures.service';

export default function NouvelleFacturePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    client_id: '',
    date_emission: new Date().toISOString().split('T')[0],
    items: [{ description: '', quantite: 1, prix_unitaire: 0 }]
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantite: 1, prix_unitaire: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    // Conversion correcte des nombres avec virgules
    if (field === 'prix_unitaire') {
      value = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    }
    if (field === 'quantite') {
      value = typeof value === 'string' ? parseFloat(value) : value;
    }
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validation
      if (!formData.client_id.trim()) {
        throw new Error('Le Client ID est requis');
      }
      
      const invalidItems = formData.items.filter(item => !item.description.trim());
      if (invalidItems.length > 0) {
        throw new Error('Toutes les descriptions doivent être remplies');
      }

      // Préparer les données pour l'API
      const factureData = {
        client_id: formData.client_id,
        date_emission: formData.date_emission,
        items: formData.items.map(item => ({
          description: item.description,
          quantite: item.quantite,
          prix_unitaire: item.prix_unitaire,
        }))
      };

      // Créer la facture
      const result = await facturesApiService.create(factureData);
      console.log('Facture créée:', result);
      
      // Redirection
      router.push('/factures');
      router.refresh(); // Rafraîchir les données
      
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      
      // Message d'erreur spécifique
      let errorMessage = 'Erreur lors de la création de la facture';
      
      if (error.message.includes('apiService')) {
        errorMessage = 'Erreur de configuration du service API. Vérifiez que le service est correctement initialisé.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calcul du total
  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.quantite * item.prix_unitaire);
    }, 0).toFixed(2);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nouvelle Facture</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          <strong>Erreur:</strong> {error}
          <p className="text-sm mt-1">Vérifiez la console pour plus de détails.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Client ID</label>
            <input 
              type="text" 
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.client_id}
              onChange={(e) => setFormData({...formData, client_id: e.target.value})}
              placeholder="ID du client"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date d'émission</label>
            <input 
              type="date" 
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.date_emission}
              onChange={(e) => setFormData({...formData, date_emission: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-medium">Articles</h3>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600">{calculateTotal()} €</span>
            </div>
          </div>
          
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end border-b pb-4 mb-4">
              <div className="col-span-6">
                <label className="text-xs text-gray-500">Description</label>
                <input 
                  type="text" 
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Description de l'article"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500">Qté</label>
                <input 
                  type="number" 
                  required
                  min="0.01"
                  step="0.01"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={item.quantite}
                  onChange={(e) => updateItem(index, 'quantite', e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <label className="text-xs text-gray-500">Prix Unitaire (€)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  step="0.01"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={item.prix_unitaire}
                  onChange={(e) => updateItem(index, 'prix_unitaire', e.target.value)}
                />
              </div>
              <div className="col-span-1 text-right">
                {formData.items.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeItem(index)}
                    className="text-red-600 p-2 hover:bg-red-50 rounded"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
          <button 
            type="button" 
            onClick={addItem}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            + Ajouter un article
          </button>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Créer la facture'}
          </button>
        </div>
      </form>
    </div>
  );
}