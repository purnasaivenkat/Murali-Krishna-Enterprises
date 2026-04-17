import { createClient } from '@insforge/sdk';

const insforgeUrl = import.meta.env.VITE_INSFORGE_URL;
const insforgeAnonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

console.log('Insforge Config:', { baseUrl: insforgeUrl });

export const insforge = createClient({

  baseUrl: insforgeUrl,
  anonKey: insforgeAnonKey,
});

