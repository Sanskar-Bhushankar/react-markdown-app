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