import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import * as mkdirp from 'mkdirp';
import { editFileName } from './edit-file-name';

const readdir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const writeFile = promisify(fs.writeFile);

export async function saveFile(
  file: Express.Multer.File,
  dirPath: string,
  fileName: string
): Promise<void> {
  try {
    if (!fs.existsSync(dirPath)) await mkdirp(dirPath);
    await writeFile(`${dirPath}/${fileName}`, file.buffer);
  } catch (error) {
    console.error(error);
  }
}

export async function removeFile(dirPath: string): Promise<void> {
  try {
    await unlink(dirPath);
  } catch (error) {
    console.error(error);
  }
}

export async function removeDir(dirPath: string): Promise<void> {
  try {
    const files = await readdir(dirPath);
    await Promise.all(
      files.map(async (file) => {
        try {
          const p = path.join(dirPath, file);
          const stat = await lstat(p);
          if (stat.isDirectory()) {
            await removeDir(p);
          } else {
            await unlink(p);
            console.log(`Removed file ${p}`);
          }
        } catch (err) {
          console.error(err);
        }
      })
    );
    await rmdir(dirPath);
    console.log(`Removed dir ${dirPath}`);
  } catch (err) {
    console.error(err);
  }
}
