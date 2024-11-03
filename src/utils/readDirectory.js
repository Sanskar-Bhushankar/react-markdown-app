export const readPagesDirectory = async () => {
  try {
    // Fetch the list of files from the pages directory
    const response = await fetch('/pages/');
    const files = await response.json();
    return files;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
};

export const readMarkdownFile = async (fileName) => {
  try {
    const response = await fetch(`/pages/${fileName}`);
    const content = await response.text();
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    return '';
  }
};
