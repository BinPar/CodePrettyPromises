import fs from 'fs';
import path from 'path';

const getTotalLinesInFiles = (pathToExplore: string): void => {
  const wordsInFiles: { [id: string]: number } = {};
  let processedFiles = 0;
  fs.readdir(
    pathToExplore,
    (err, files): void => {
      if (err) {
        throw err;
      } else {
        files.forEach(
          (fileName): void => {
            const filePath = `${pathToExplore}${fileName}`;
            fs.lstat(
              filePath,
              (lstatErr, info): void => {
                if (lstatErr) {
                  processedFiles++;
                  throw lstatErr;
                } else if (info.isFile()) {
                  fs.readFile(
                    filePath,
                    { encoding: 'utf-8' },
                    (readErr, data): void => {
                      if (readErr) {
                        processedFiles++;
                        throw readErr;
                      } else {
                        const totalLines = data.split('\n').length;
                        wordsInFiles[fileName] = totalLines;
                        processedFiles++;
                        if (processedFiles === files.length) {
                          const text = JSON.stringify(wordsInFiles, null, 2);
                          fs.writeFile(
                            'result/total.txt',
                            {
                              encoding: 'utf-8',
                            },
                            text,
                            (writingError): void => {
                              if (writingError) {
                                throw writingError;
                              }
                            }
                          );
                          console.log(text);
                        }
                      }
                    }
                  );
                } else {
                  processedFiles++;
                }
              }
            );
          }
        );
      }
    }
  );
};

const pathToExplore = path.join(__dirname, '../');

getTotalLinesInFiles(pathToExplore);
