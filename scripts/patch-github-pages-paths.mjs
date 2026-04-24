import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');
const base = '/pavel_blog';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }
    return fullPath;
  }));

  return files.flat();
}

function prefixRootPathAttributes(html) {
  return html
    .replace(/(href|src)=("|')\/_astro\//g, `$1=$2${base}/_astro/`)
    .replace(
      /\b(href|src|action|poster|content)=("|')\/(?!\/|_astro\/|pavel_blog\/|https?:|mailto:|tel:)([^"'#?]*)([^"']*)\2/g,
      (_, attr, quote, pathname, suffix) => `${attr}=${quote}${base}/${pathname}${suffix}${quote}`,
    );
}

async function patchHtmlFile(filePath) {
  const original = await readFile(filePath, 'utf8');
  const patched = prefixRootPathAttributes(original);

  if (patched !== original) {
    await writeFile(filePath, patched, 'utf8');
  }
}

const files = await walk(distDir);
const htmlFiles = files.filter((file) => file.endsWith('.html'));

await Promise.all(htmlFiles.map(patchHtmlFile));
