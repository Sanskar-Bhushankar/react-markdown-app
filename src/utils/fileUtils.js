export const fetchFilesList = async () => {
  try {
    const response = await fetch('/api/pages');
    if (!response.ok) throw new Error('Failed to fetch files');
    return await response.json();
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

export const fetchFileContent = async (filePath) => {
  try {
    const response = await fetch(`/pages/${filePath}`);
    if (!response.ok) throw new Error('Failed to load file');
    return await response.text();
  } catch (error) {
    console.error('Error loading file:', error);
    throw error;
  }
};

export const getAllMarkdownFiles = async () => {
  try {
    const response = await fetch('/api/sidebar');
    const data = await response.json();
    
    const extractFiles = (items) => {
      let files = [];
      items.forEach(item => {
        if (item.type === 'file' && item.path.endsWith('.md')) {
          files.push(item.path);
        }
        if (item.type === 'directory' && item.children) {
          files = files.concat(extractFiles(item.children));
        }
      });
      return files;
    };

    return extractFiles(data);
  } catch (error) {
    console.error('Error getting markdown files:', error);
    return [];
  }
}; 