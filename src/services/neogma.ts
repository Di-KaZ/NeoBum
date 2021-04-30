import { Neogma } from 'neogma';

export const neogma = new Neogma(
  {
    url: import.meta.env.VITE_NEO4J_URL,
    username: import.meta.env.VITE_NEO4J_USERNAME,
    password: import.meta.env.VITE_NEO4J_PASSWORD
  },
  {}
);
