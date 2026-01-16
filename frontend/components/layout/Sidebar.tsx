// Fichier: erp-facturation-pwa/frontend/components/layout/Sidebar.tsx
// TODO: Composant de barre latérale de navigation
// TODO: Afficher les liens de navigation (Dashboard, Factures, Livraisons, etc.)
// TODO: Gérer l'état actif et les permissions (Rôles)

import React from 'react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold">ERP Facturation</h1>
      </div>
      <nav className="mt-6">
        {/* TODO: Liste des liens de navigation */}
        <a href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          Tableau de bord
        </a>
        {/* ... autres liens ... */}
      </nav>
    </aside>
  );
};
