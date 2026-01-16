// Fichier: erp-facturation-pwa/frontend/components/layout/Footer.tsx
// TODO: Composant de pied de page
// TODO: Informations de copyright, version de l'application

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="p-4 text-center text-sm text-gray-500 border-t">
      © {new Date().getFullYear()} ERP Facturation. Version 1.0.0.
    </footer>
  );
};
