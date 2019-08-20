import fs from 'fs';
import path from 'path';
import util from 'util';

const exists = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);
const lstat = util.promisify(fs.lstat);

const getTotalLinesInFile = async (pathToExplore: string): Promise<number> => {
  try {
    const fileExists = await exists(pathToExplore);
    if (fileExists) {
      const fullText = await readFile(pathToExplore, { encoding: 'utf-8' });
      const totalLines = fullText.split('\n').length;
      return totalLines;
    } 
      return 0;
    
  } catch (err) {
    throw err;
  }
};

const dirToExplore = path.join(__dirname, '../');

const exploreDir = async (pathToExplore: string): Promise<void> => {
  const files = await readDir(pathToExplore);
  const filesOnly: string[] = [];
  const info = files.map(
    async (fileName): Promise<fs.Stats> => {
      return lstat(dirToExplore + fileName);
    }
  );
  const infos = await Promise.all(info);

  infos.forEach(
    (fileInfo, index): void => {
      if (fileInfo.isFile()) {
        filesOnly.push(files[index]);
      }
    }
  );
  const calcFileLines = filesOnly.map(
    async (fileName): Promise<number> => {
      return getTotalLinesInFile(dirToExplore + fileName);
    }
  );
  const linesInEachFile = await Promise.all(calcFileLines);
  console.log(linesInEachFile);
};

exploreDir(dirToExplore).finally(
  (): void => {
    console.log('OK');
  }
);
