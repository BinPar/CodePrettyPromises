import fs from 'fs';
import path from 'path';

const exists = (filePath: string): Promise<string> => {
  return new Promise<string>(
    (resolve): void => {
      fs.exists(
        filePath,
        (existsFile): void => {
          if (existsFile) {
            resolve(filePath);
          } else {
            resolve('');
          }
        }
      );
    }
  );
};

const getWordsInFile = (filePath: string): Promise<number> => {
  return new Promise<number>(
    (resolve, reject): void => {
      if (filePath) {
        fs.readFile(
          filePath,
          { encoding: 'utf-8' },
          (err, content): void => {
            if (err) {
              reject(err);
              return;
            }
            const totalLines = content.split('\n').length;
            resolve(totalLines);
          }
        );
      } else {
        resolve(0);
      }
    }
  );
};

const saveFileStats = (numberOfLines: number): Promise<void> => {
  return new Promise<void>(
    (resolve, reject): void => {
      fs.writeFile(
        './result/linesInPackage.txt',
        numberOfLines.toString(),
        { encoding: 'utf-8' },       
        (err): void => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    }
  );
};

const fileToExplore = path.join(__dirname, '../package.json');

exists(fileToExplore)
  .then(getWordsInFile)
  .then(saveFileStats)
  .catch(
    (err): void => {
      throw err;
    }
  )
  .finally(
    (): void => {
      console.log('OK');
    }
  );
