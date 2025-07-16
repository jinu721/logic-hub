export const isEqual = (expectedOutput: any, actualOutput: any) => {
  const expectedNum = Number(expectedOutput);
  const actualNum = Number(actualOutput);
  const bothAreNumbers = !isNaN(expectedNum) && !isNaN(actualNum);

  if (bothAreNumbers) {
    return Math.abs(expectedNum - actualNum) < 1e-9;
  }
  try {
    const expectedParsed = JSON.parse(expectedOutput);
    const actualParsed = JSON.parse(actualOutput);
    return JSON.stringify(expectedParsed) === JSON.stringify(actualParsed);
  } catch (err) {
    return expectedOutput === actualOutput;
  }
}