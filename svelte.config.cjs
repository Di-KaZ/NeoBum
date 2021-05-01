const preprocess = require('svelte-preprocess');
const netlify = require('@sveltejs/adapter-netlify');
/** @type {import('@sveltejs/kit').Config} */
module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: netlify(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte'
  }
};
