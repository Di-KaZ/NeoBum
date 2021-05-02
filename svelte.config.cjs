const preprocess = require('svelte-preprocess');
const vercel = require('@sveltejs/adapter-vercel');
/** @type {import('@sveltejs/kit').Config} */
module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: vercel(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    vite: {
      optimizeDeps: {
        include: ['neo4j-driver']
      }
    }
  }
};
