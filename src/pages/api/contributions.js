import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const contributions = {};
    const pagesDir = path.join(process.cwd(), 'public', 'pages');

    const processFile = (filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Updated regex to match your specific format
      const dateMatch = content.match(/date:\s*"(\d{4}-\d{2}-\d{2})"/);
      
      if (dateMatch && dateMatch[1]) {
        const date = dateMatch[1];
        contributions[date] = (contributions[date] || 0) + 1;
        console.log(`Found contribution for ${date} in ${filePath}`); // Debug log
      }
    };

    const processDirectory = (dirPath) => {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        if (fs.statSync(fullPath).isDirectory()) {
          processDirectory(fullPath);
        } else if (item.endsWith('.md')) {
          processFile(fullPath);
        }
      });
    };

    processDirectory(pagesDir);
    console.log('All contributions:', contributions); // Debug log
    res.status(200).json(contributions);
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ error: 'Failed to read files' });
  }
} 