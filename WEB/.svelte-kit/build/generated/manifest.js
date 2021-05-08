const c = [
	() => import("..\\..\\..\\src\\routes\\__layout.svelte"),
	() => import("..\\components\\error.svelte"),
	() => import("..\\..\\..\\src\\routes\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\Artists.svelte"),
	() => import("..\\..\\..\\src\\routes\\Albums\\[id].svelte"),
	() => import("..\\..\\..\\src\\routes\\Albums.svelte"),
	() => import("..\\..\\..\\src\\routes\\Groups.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/Artists.svelte
	[/^\/Artists\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/Albums/[id].svelte
	[/^\/Albums\/([^/]+?)\/?$/, [c[0], c[4]], [c[1]], (m) => ({ id: d(m[1])})],

	// src/routes/Albums.svelte
	[/^\/Albums\/?$/, [c[0], c[5]], [c[1]]],

	// src/routes/Groups.svelte
	[/^\/Groups\/?$/, [c[0], c[6]], [c[1]]]
];

export const fallback = [c[0](), c[1]()];