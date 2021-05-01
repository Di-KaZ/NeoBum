/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_NEO4J_URL: string;
  VITE_NEO4J_USERNAME: string;
  VITE_NEO4J_PASSWORD: string;
}

declare let neo4j: Record<string, any>;
