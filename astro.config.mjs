import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig(({ command }) => ({
  site: 'https://pavelpeng7.github.io',
  base: command === 'dev' ? '/' : '/pavel_blog',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
}));
