export const extractUserLogs = (stdout: string): string => {
  const startMarker = '===USER_LOGS_START===';
  const endMarker = '===USER_LOGS_END===';
  
  const startIndex = stdout.indexOf(startMarker);
  const endIndex = stdout.indexOf(endMarker);
  
  if (startIndex === -1 || endIndex === -1) {
    return '';
  }
  
  return stdout.substring(
    startIndex + startMarker.length,
    endIndex
  ).trim();
}