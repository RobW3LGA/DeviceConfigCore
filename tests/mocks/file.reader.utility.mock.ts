const fileReaderMockArrange = (testFileContent: string, testResponseMs = 0, throwError = false) => async (filePath: string) => {

  if (throwError) { throw `Thrown by test: ${testFileContent}` }
  else {

    ((ms) => {

      let timeCheck = null;
      const now = Date.now();
      do { timeCheck = Date.now() }
      while(timeCheck - now < ms);
    })(testResponseMs);

    return Buffer.from(`FilePath: ${filePath}\nContent:\n${testFileContent}`);
  }
}

export { fileReaderMockArrange };
