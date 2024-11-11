import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildSidebarTree() {
  const pagesDir = path.join(dirname(__dirname), 'public', 'pages');
  const outputDir = path.join(dirname(__dirname), 'src', 'data');

  try {
    // Create data directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // Get the file tree structure
    const tree = await getFileTree(pagesDir);

    // Write as a JavaScript module
    const fileContent = `// Auto-generated file tree
export const sidebarTree = ${JSON.stringify(tree, null, 2)};`;

    await fs.writeFile(
      path.join(outputDir, 'sidebarTree.js'),
      fileContent
    );

    console.log('Sidebar tree generated successfully!');
  } catch (error) {
    console.error('Error generating sidebar tree:', error);
    process.exit(1);
  }
}

async function getFileTree(dir) {
  const items = await fs.readdir(dir);
  const result = [];

  for (const item of items) {
    if (item.startsWith('.')) continue;

    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);
    // Get path relative to pages directory
    const relativePath = path.relative(path.join(dirname(__dirname), 'public', 'pages'), fullPath);

    if (stat.isDirectory()) {
      const children = await getFileTree(fullPath);
      if (children.length > 0) {
        result.push({
          name: item,
          path: relativePath,
          type: 'directory',
          children
        });
      }
    } else if (item.endsWith('.md')) {
      result.push({
        name: item,
        path: relativePath,
        type: 'file'
      });
    }
  }

  return result;
}

buildSidebarTree(); 