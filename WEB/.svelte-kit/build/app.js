import { respond } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "./hooks.js";

const template = ({ head, body }) => "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\" />\r\n    <link rel=\"icon\" href=\"/favicon.ico\" />\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\r\n    " + head + "\r\n  </head>\r\n  <body>\r\n    <div id=\"svelte\">" + body + "</div>\r\n  </body>\r\n</html>\r\n";

let options = null;

// allow paths to be overridden in svelte-kit preview
// and in prerendering
export function init(settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: "/./_app/start-3f529b55.js",
			css: ["/./_app/assets/start-a8cd1609.css","/./_app/assets/vendor-c0c47e58.css"],
			js: ["/./_app/start-3f529b55.js","/./_app/chunks/vendor-8266c06c.js","/./_app/chunks/singletons-bb9012b7.js"]
		},
		fetched: undefined,
		floc: false,
		get_component_path: id => "/./_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: error => {
			console.error(error.stack);
			error.stack = options.get_stack(error);
		},
		hooks: get_hooks(user_hooks),
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		read: settings.read,
		root,
		router: true,
		ssr: true,
		target: "#svelte",
		template
	};
}

const d = decodeURIComponent;
const empty = () => ({});

const manifest = {
	assets: [],
	layout: "src/routes/__layout.svelte",
	error: ".svelte-kit/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/Artists\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/Artists.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/Albums\/([^/]+?)\/?$/,
						params: (m) => ({ id: d(m[1])}),
						a: ["src/routes/__layout.svelte", "src/routes/Albums/[id].svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/Albums\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/Albums.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/Groups\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/Groups.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, render }) => render(request))
});

const module_lookup = {
	"src/routes/__layout.svelte": () => import("..\\..\\src\\routes\\__layout.svelte"),".svelte-kit/build/components/error.svelte": () => import("./components\\error.svelte"),"src/routes/index.svelte": () => import("..\\..\\src\\routes\\index.svelte"),"src/routes/Artists.svelte": () => import("..\\..\\src\\routes\\Artists.svelte"),"src/routes/Albums/[id].svelte": () => import("..\\..\\src\\routes\\Albums\\[id].svelte"),"src/routes/Albums.svelte": () => import("..\\..\\src\\routes\\Albums.svelte"),"src/routes/Groups.svelte": () => import("..\\..\\src\\routes\\Groups.svelte")
};

const metadata_lookup = {"src/routes/__layout.svelte":{"entry":"/./_app/pages/__layout.svelte-9c875f7c.js","css":["/./_app/assets/pages/__layout.svelte-a9d8ef93.css","/./_app/assets/vendor-c0c47e58.css"],"js":["/./_app/pages/__layout.svelte-9c875f7c.js","/./_app/chunks/vendor-8266c06c.js","/./_app/chunks/navigation-20968cc5.js","/./_app/chunks/singletons-bb9012b7.js","/./_app/chunks/neo4j-36fd0ed7.js"],"styles":null},".svelte-kit/build/components/error.svelte":{"entry":"/./_app/error.svelte-dd19c049.js","css":["/./_app/assets/vendor-c0c47e58.css"],"js":["/./_app/error.svelte-dd19c049.js","/./_app/chunks/vendor-8266c06c.js"],"styles":null},"src/routes/index.svelte":{"entry":"/./_app/pages/index.svelte-0505efd8.js","css":["/./_app/assets/vendor-c0c47e58.css"],"js":["/./_app/pages/index.svelte-0505efd8.js","/./_app/chunks/vendor-8266c06c.js","/./_app/chunks/navigation-20968cc5.js","/./_app/chunks/singletons-bb9012b7.js"],"styles":null},"src/routes/Artists.svelte":{"entry":"/./_app/pages/Artists.svelte-1ab8ec7a.js","css":["/./_app/assets/vendor-c0c47e58.css"],"js":["/./_app/pages/Artists.svelte-1ab8ec7a.js","/./_app/chunks/vendor-8266c06c.js","/./_app/chunks/navigation-20968cc5.js","/./_app/chunks/singletons-bb9012b7.js","/./_app/chunks/neo4j-36fd0ed7.js","/./_app/chunks/Pagination-4d6a17b8.js"],"styles":null},"src/routes/Albums/[id].svelte":{"entry":"/./_app/pages/Albums/[id].svelte-8a4da1be.js","css":["/./_app/assets/vendor-c0c47e58.css"],"js":["/./_app/pages/Albums/[id].svelte-8a4da1be.js","/./_app/chunks/vendor-8266c06c.js"],"styles":null},"src/routes/Albums.svelte":{"entry":"/./_app/pages/Albums.svelte-37aeaeb1.js","css":["/./_app/assets/pages/Albums.svelte-0868024d.css","/./_app/assets/vendor-c0c47e58.css"],"js":["/./_app/pages/Albums.svelte-37aeaeb1.js","/./_app/chunks/vendor-8266c06c.js","/./_app/chunks/navigation-20968cc5.js","/./_app/chunks/singletons-bb9012b7.js","/./_app/chunks/neo4j-36fd0ed7.js","/./_app/chunks/Pagination-4d6a17b8.js"],"styles":null},"src/routes/Groups.svelte":{"entry":"/./_app/pages/Groups.svelte-8450b2b3.js","css":["/./_app/assets/vendor-c0c47e58.css"],"js":["/./_app/pages/Groups.svelte-8450b2b3.js","/./_app/chunks/vendor-8266c06c.js","/./_app/chunks/navigation-20968cc5.js","/./_app/chunks/singletons-bb9012b7.js","/./_app/chunks/neo4j-36fd0ed7.js","/./_app/chunks/Pagination-4d6a17b8.js"],"styles":null}};

async function load_component(file) {
	return {
		module: await module_lookup[file](),
		...metadata_lookup[file]
	};
}

init({ paths: {"base":"","assets":"/."} });

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return respond({ ...request, host }, options, { prerender });
}