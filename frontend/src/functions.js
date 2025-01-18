async function fetchRepoContents(repoUrl, wpm) {
    // Extract owner and repo name from URL
    const urlParts = repoUrl.split('github.com/')[1].split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];
    
    const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
    };
  
    async function getFileContent(path) {
      const response = await fetch(`${baseUrl}/contents/${path}`, { headers });
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        const content = atob(data.content);
        return {
          name: data.name,
          content: content,
          type: 'file'
        };
      }
      
      const contents = await Promise.all(
        data.map(async (item) => {
          if (item.type === 'dir') {
            return getFileContent(item.path);
          }
          return getFileContent(item.path);
        })
      );
  
      return contents.flat();
    }
  
    try {
      const files = await getFileContent('');
      return analyzeFiles(files, wpm);
    } catch (error) {
      throw new Error(`Failed to fetch repository contents: ${error.message}`);
    }
  }
  
  function analyzeFiles(files, wpm) {
    let totalWords = 0;
    const TOTAL_TIME_LIMIT = 3; // 3 hours limit
  
    function countWords(content) {
      // Remove comments
      const noComments = content
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')  // Remove /* */ and // comments
        .replace(/#.*/g, '');                      // Remove Python # comments
      
      // Remove common code syntax and normalize spaces
      const processedContent = noComments
        .replace(/[{}[\]()=+\-*/&|<>!;:]/g, ' ')  // Replace code syntax with spaces
        .replace(/\s+/g, ' ')                      // Normalize whitespace
        .trim();
  
      // Count words
      return processedContent.split(/\s+/).length;
    }
  
    // Process each file
    files.forEach(file => {
      if (file.type === 'file') {
        totalWords += countWords(file.content);
      }
    });
  
    // Calculate time to type
    const timeToType = totalWords / wpm; // time in minutes
    const hours = Math.floor(timeToType / 60);
    const minutes = Math.floor(timeToType % 60);
  
    // Check if time exceeds limit
    const hasExternalCode = hours > TOTAL_TIME_LIMIT;
  
    return {
      totalWords,
      timeToType: {
        hours,
        minutes
      },
      hasExternalCode,
      analysis: hasExternalCode ? 
        "This repository likely contains external code or generated content, as it would take more than 3 hours to type." :
        "The code in this repository could have been typed manually within the expected timeframe."
    };
  }
  export default  fetchRepoContents;