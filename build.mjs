import { cp, mkdir } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
for (const path of ['index.html', 'style.css', 'films.js', 'catalogue.js', 'assets', '_headers']) {
  await cp(path, 'dist/' + path, { recursive: true });
}
