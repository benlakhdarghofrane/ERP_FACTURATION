'use client';

import { useEffect, useState } from 'react';
import { facturesApiService, Facture } from '../../services/factures.service';
import Link from 'next/link';

export default function FacturesPage() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFactures();
  }, []);

  const loadFactures = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ⚠️ CORRECTION ICI : facturesApiService.getAll() retourne un objet {data: [], success: true}
      // Il faut extraire le tableau de données
      const response = await facturesApiService.getAll();
      
      console.log('Réponse API:', response); // Pour debug
      
      // Vérifier si la réponse a un champ 'data'
      if (response && typeof response === 'object' && 'data' in response) {
        // C'est un objet {success, data, count}
        setFactures(Array.isArray(response.data) ? response.data : []);
      } else if (Array.isArray(response)) {
        // C'est déjà un tableau
        setFactures(response);
      } else {
        // Format inconnu
        console.error('Format de réponse inconnu:', response);
        setFactures([]);
        setError('Format de données incorrect');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des factures', error);
      setError('Impossible de charger les factures');
      setFactures([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir le nom du client
  const getClientName = (facture: Facture) => {
    // Si l'API retourne les données jointes
    if ((facture as any).clients?.nom_entreprise) {
      return (facture as any).clients.nom_entreprise;
    }
    // Sinon, afficher l'ID du client
    return `Client ${facture.client_id?.substring(0, 8) || 'Inconnu'}`;
  };

  // Fonction pour le style du statut
  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'payee':
        return 'bg-green-100 text-green-800';
      case 'validee':
        return 'bg-blue-100 text-blue-800';
      case 'annulee':
        return 'bg-red-100 text-red-800';
      default: // brouillon
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Factures</h1>
        </div>
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Factures</h1>
          <Link 
            href="/factures/nouveau" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Nouvelle Facture
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <strong>Erreur :</strong> {error}
          <button 
            onClick={loadFactures}
            className="ml-4 text-blue-600 hover:text-blue-800 underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Factures</h1>
        <Link 
          href="/factures/nouveau" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Nouvelle Facture
        </Link>
      </div>

      {factures.length === 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-10 text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mb-4">Aucune facture trouvée.</p>
            <Link 
              href="/factures/nouveau" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Créer votre première facture
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Facture</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant TTC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {factures.map((f) => {
                const statutStyle = getStatutStyle(f.statut);
                const statutLabel = f.statut.toUpperCase();
                
                return (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{f.numero_facture}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getClientName(f)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(f.date_emission).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {f.montant_ttc.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${statutStyle}`}>
                        {statutLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/factures/${f.id}`} 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Voir
                      </Link>
                      <Link 
                        href={`/factures/${f.id}/editer`} 
                        className="text-green-600 hover:text-green-900"
                      >
                        Éditer
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Résumé en bas */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {factures.length} facture{factures.length > 1 ? 's' : ''}
              </span>
              <span className="font-medium">
                Total: {factures.reduce((sum, f) => sum + f.montant_ttc, 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Bouton rafraîchir */}
      <div className="mt-4 text-right">
        <button
          onClick={loadFactures}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Rafraîchir
        </button>
      </div>
    </div>
  );
}