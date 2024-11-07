import fs from 'fs/promises';
import path from 'path';

export const configureServer = (server) => {
  server.middlewares.use(async (req, res, next) => {
    if (req.url === '/api/pages') {
      try {
        const pagesDir = path.join(process.cwd(), 'public', 'pages');
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

async function listFilesRecursively(dir) {
  try {
    const items = await fs.readdir(dir);
    const files = [];

    for (const item of items) {
      // Skip hidden files and special directories
      if (item.startsWith('.') || item === 'node_modules') continue;

      const fullPath = path.join(dir, item);
      const stat = await fs.stat(fullPath);
      
      // Get relative path from the pages directory
      const relativePath = path.relative(path.join(process.cwd(), 'public', 'pages'), fullPath);

      if (stat.isDirectory()) {
        const children = await listFilesRecursively(fullPath);
        files.push({
          name: item,
          path: relativePath,
          isDirectory: true,
          children: children
        });
      } else if (item.endsWith('.md')) {
        files.push({
          name: item,
          path: relativePath,
          isDirectory: false
        });
      }
    }

    // Sort directories first, then files alphabetically
    return files.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}
