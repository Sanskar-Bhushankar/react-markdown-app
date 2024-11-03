import fs from 'fs/promises';
import path from 'path';

export const configureServer = (server) => {
  server.middlewares.use(async (req, res, next) => {
    if (req.url === '/api/pages') {
      try {
        const pagesDir = path.join(process.cwd(), 'public/pages');
        const files = await listFilesRecursively(pagesDir);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(files));
      } catch (error) {
        console.error('Error reading pages directory:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Failed to read pages directory' }));
      }
    } else {
      next();
    }
  });
};

async function listFilesRecursively(dir, baseDir = '') {
  const items = await fs.readdir(dir);
  const files = [];

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(baseDir, item);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      files.push({
        name: item,
        path: relativePath,
        isDirectory: true,
        children: await listFilesRecursively(fullPath, relativePath)
      });
    } else {
      files.push({
        name: item,
        path: relativePath,
        isDirectory: false
      });
    }
  }

  return files;
}
