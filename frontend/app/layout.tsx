// Fichier: erp-facturation-pwa/frontend/app/layout.tsx
// TODO: Importer les polices et les styles globaux
// TODO: Configurer le contexte de l'application (Auth, Offline, Sync)

import './../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {/* TODO: Ajouter le fournisseur de contexte global */}
        {children}
      </body>
    </html>
  );
}
