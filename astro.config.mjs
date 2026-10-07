// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Project site: served from https://healthcareirainian.github.io/IranianHealthcare.github.io/
// If the repo is renamed to healthcareirainian.github.io (or a custom domain is added), set base to '/'.
export default defineConfig({
  site: 'https://healthcareirainian.github.io',
  base: '/IranianHealthcare.github.io',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
