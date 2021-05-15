import node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    appDir: '_app',
    files: {
      assets: 'static',
      routes: 'src/routes',
      template: 'src/app.html'
    },
    adapter: node({ out: 'dist' }),
    target: '#svelte',
    vite: {
      optimizeDeps: {
        include: ['neo4j-driver']
      }
    }
  }
};

export default config;
