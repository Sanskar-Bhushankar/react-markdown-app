import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const pagesDirectory = path.join(process.cwd(), 'public', 'pages');
  
  try {
    const contributions = {};
    
    function processDirectory(directory) {
      const items = fs.readdirSync(directory);
      
      items.forEach(item => {
        const fullPath = path.join(directory, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          processDirectory(fullPath);
        } else if (item.endsWith('.md')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const match = content.match(/---\s*\n.*?\bdate:\s*"?(\d{4}-\d{2}-\d{2})"?\s*\n.*?---/s);
          
          if (match && match[1]) {
            const date = match[1];
            contributions[date] = (contributions[date] || 0) + 1;
            console.log(`Found contribution for date: ${date} in file: ${item}`);
          }
        }
      });
    }
    
    processDirectory(pagesDirectory);
    console.log('All contributions:', contributions);
    res.status(200).json(contributions);
  } catch (error) {
    console.error('Error reading markdown files:', error);
    res.status(500).json({ error: 'Failed to read markdown files' });
  }
} 