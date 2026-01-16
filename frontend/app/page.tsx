// Fichier: erp-facturation-pwa/frontend/app/page.tsx
// TODO: Redirection vers /dashboard si l'utilisateur est connecté, sinon vers /auth/login

import { redirect } from 'next/navigation';

export default function HomePage() {
  // Logique de vérification de l'authentification à implémenter
  const isAuthenticated = false; // Placeholder

  if (isAuthenticated) {
    redirect('/dashboard');
  } else {
    redirect('/auth/login');
  }
}
