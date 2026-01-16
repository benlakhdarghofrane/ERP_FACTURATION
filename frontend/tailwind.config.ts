// Fichier: erp-facturation-pwa/frontend/tailwind.config.ts
// TODO: Configuration minimale de Tailwind CSS

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // TODO: Ajouter la palette de couleurs de l'entreprise
    },
  },
  plugins: [
    // TODO: Ajouter des plugins (e.g., forms, typography)
  ],
};

export default config;
