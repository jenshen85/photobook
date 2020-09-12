import { Injectable } from '@nestjs/common';

import { saveFile, removeDir, removeFile } from '../shared/utils/files-utils';
import { editFileName } from '../shared/utils/edit-file-name';

export interface IFileData {
  imageUrl: string;
  fileName: string;
}

const uploadsRoot = 'uploads';

@Injectable()
export class FileService {
  async saveFile(
    file: Express.Multer.File,
    dirPath: string,
    fileName?: string
  ): Promise<IFileData> {
    const fName = editFileName(file, fileName);
    const imageUrl = `${dirPath}/${fName}`;
    const url = `${uploadsRoot}/${dirPath}`;
    await saveFile(file, url, fName);
    return { imageUrl, fileName: fName };
  }

  async deleteFile(pathtoFile: string): Promise<void> {
    const url = `${uploadsRoot}/${pathtoFile}`;
    return await removeFile(url);
  }

  async deleteDir(dirPath: string): Promise<void> {
    const url = `${uploadsRoot}/${dirPath}`;
    return await removeDir(url);
  }
}
