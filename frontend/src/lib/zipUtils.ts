
/**
 * Utility functions for handling ZIP files
 */

import JSZip from 'jszip';

/**
 * Extract contents from a ZIP file
 * @param zipBlob - Blob containing ZIP data
 * @returns Array of extracted files with their names and data URLs
 */
export const extractZipContents = async (
  zipBlob: Blob
): Promise<Array<{ name: string; url: string }>> => {
  const jszip = new JSZip();
  const zipContents = await jszip.loadAsync(zipBlob);
  
  const extractedFiles: Array<{ name: string; url: string }> = [];
  
  const filePromises = Object.keys(zipContents.files).map(async (filename) => {
    // Skip directories
    if (zipContents.files[filename].dir) {
      return;
    }
    
    // Get file data as array buffer
    const content = await zipContents.files[filename].async('blob');
    
    // Create object URL for the file
    const url = URL.createObjectURL(content);
    
    extractedFiles.push({
      name: filename,
      url,
    });
  });
  
  await Promise.all(filePromises);
  return extractedFiles;
};

/**
 * Clean up object URLs to prevent memory leaks
 * @param urls - Array of object URLs to revoke
 */
export const revokeObjectUrls = (urls: string[]): void => {
  urls.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
};
