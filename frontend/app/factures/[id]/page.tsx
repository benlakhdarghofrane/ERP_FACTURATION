'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { facturesApiService, Facture } from '../../../services/factures.service';

export default function DetailFacturePage() {
  const { id } = useParams();
  const router = useRouter();
  const [facture, setFacture] = useState<Facture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadFacture();
  }, [id]);

  const loadFacture = async () => {
    setLoading(true);
    try {
      const data = await facturesApiService.getOne(id as string);
      setFacture(data);
    } catch (error) {
      console.error('Erreur', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValider = async () => {
    if (!facture) return;
    try {
      await facturesApiService.valider(facture.id!);
      loadFacture();
    } catch (error) {
      alert('Erreur lors de la validation');
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (!facture) return <div className="p-6">Facture non trouvée</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{facture.numero_facture}</h1>
          <p className="text-gray-500">Émise le {new Date(facture.date_emission).toLocaleDateString()}</p>
        </div>
        <div className="flex space-x-2">
          {facture.statut === 'brouillon' && (
            <button 
              onClick={handleValider}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Valider la facture
            </button>
          )}
          <button 
            onClick={() => window.print()}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
          >
            Imprimer PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Émetteur</h3>
          <p className="font-bold">Ma Super Entreprise</p>
          <p className="text-sm text-gray-600">123 Rue de l'ERP, 75000 Paris</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Client</h3>
          <p className="font-bold">{(facture as any).clients?.nom_entreprise}</p>
          <p className="text-sm text-gray-600">{(facture as any).clients?.adresse}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qté</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">P.U. HT</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(facture as any).facture_items?.map((item: any) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">{item.quantite}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">{item.prix_unitaire.toLocaleString()} €</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">{item.montant_ht.toLocaleString()} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total HT</span>
            <span className="font-medium">{facture.montant_ht.toLocaleString()} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">TVA (20%)</span>
            <span className="font-medium">{facture.montant_tva.toLocaleString()} €</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total TTC</span>
            <span className="text-blue-600">{facture.montant_ttc.toLocaleString()} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}
