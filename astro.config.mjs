import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig(({ command }) => ({
  site: 'https://kpab.github.io',
  base: command === 'dev' ? '/' : '/astro-darkness',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
}));
