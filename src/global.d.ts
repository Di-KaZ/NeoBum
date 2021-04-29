/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />
interface ImportMetaEnv {
	VITE_NEO4J_URL: string;
	VITE_NEO4J_USERNAME: string;
	VITE_NEO4J_PASSWORD: string;
}

declare namespace VANTA {
	const VANTA: any;
	export default VANTA;
}
