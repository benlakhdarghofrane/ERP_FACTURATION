// Fichier: erp-facturation-pwa/frontend/components/layout/Header.tsx
// TODO: Composant d'en-tête
// TODO: Afficher le nom de l'utilisateur, les notifications, le bouton de déconnexion
// TODO: Bouton de synchronisation (Online/Offline)

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-xl font-semibold">
        {/* TODO: Titre de la page actuelle */}
        Page Title
      </div>
      <div className="flex items-center space-x-4">
        {/* TODO: Indicateur de statut Offline/Online */}
        <span className="text-sm text-gray-500">
          Statut: {/* TODO: Afficher "Online" ou "Offline" */}
        </span>
        {/* TODO: Menu utilisateur */}
        <button className="p-2 rounded-full bg-gray-200">
          {/* TODO: Icône utilisateur */}
          User
        </button>
      </div>
    </header>
  );
};
