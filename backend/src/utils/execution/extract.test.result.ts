export const extractTestResults = (output: string): any[] => {
  try {
    // Look for the test results between the markers
    const startMarker = '===TEST_RESULTS_START===';
    const endMarker = '===TEST_RESULTS_END===';
    
    const startIndex = output.indexOf(startMarker);
    const endIndex = output.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
      console.error('Test result markers not found in output:', output);
      return [];
    }
    
    const jsonString = output.substring(
      startIndex + startMarker.length, 
      endIndex
    ).trim();
    
    if (!jsonString) {
      console.error('No JSON content found between markers');
      return [];
    }
    
    const results = JSON.parse(jsonString);
    const resultsArray = Array.isArray(results) ? results : [results];
    
    // Extract just the result values, not the wrapper objects
    return resultsArray.map(item => {
      if (item && typeof item === 'object' && 'success' in item) {
        if (item.success && 'result' in item) {
          return item.result;
        } else if (!item.success && 'error' in item) {
          return { error: item.error };
        }
      }
      return item;
    });
    
  } catch (error) {
    console.error('Failed to extract test results:', error);
    console.error('Raw output:', output);
    return [];
  }
}