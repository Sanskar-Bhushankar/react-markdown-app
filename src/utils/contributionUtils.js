import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

export const getAllContributions = () => {
  const contributions = new Map(); // date -> count

  const processFile = (filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(content);
      
      if (data.date) {
        // Parse the date string "YYYY-MM-DD" format
        const [year, month, day] = data.date.split('-').map(num => parseInt(num));
        const dateKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        contributions.set(dateKey, (contributions.get(dateKey) || 0) + 1);
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  };

  const processDirectory = (dir) => {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        processDirectory(fullPath);
      } else if (file.endsWith('.md')) {
        processFile(fullPath);
      }
    }
  };

  // Start processing from the pages directory
  const pagesDir = path.join('public', 'pages');
  processDirectory(pagesDir);

  return contributions;
}; 