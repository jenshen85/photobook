import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sharp from 'sharp';

import { removeDir, removeFile } from '../shared/utils/files-utils';
import { editFileName } from '../shared/utils/edit-file-name';

export interface PhotoInfoType {
  width: number;
  height: number;
  dimension: string;
  ratio: number;
}

export interface IFileData extends PhotoInfoType {
  imageUrl: string;
  fileName: string;
}

const uploadsRoot = 'uploads';

@Injectable()
export class FileService {
  async saveFile(
    file: Express.Multer.File,
    dirPath: string,
    fName?: string
  ): Promise<IFileData> {
    const fileName = editFileName(file, fName);
    const imageUrl = `${dirPath}/${fileName}`;
    const url = `${uploadsRoot}/${dirPath}`;
    try {
      const f = sharp(file.buffer);
      const meta = await f.metadata();
      await f.toFile(`${url}/${fileName}`);

      const width = meta.width;
      const height = meta.height;
      const ratio = Math.round((height / width) * 100) / 100;
      const dimension = `${meta.width}x${meta.height}`;

      return {
        imageUrl,
        fileName,
        width,
        height,
        dimension,
        ratio,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async savePreview(photoPath: string, photoName: string): Promise<string> {
    const imgPath = `${uploadsRoot}/${photoPath}/${photoName}`;
    const previewPath = `${photoPath}/preview_${photoName}`;
    const previewPathToPhoto = `${uploadsRoot}/${previewPath}`;

    try {
      const f = sharp(imgPath);
      await f.resize({ width: 300 }).toFile(previewPathToPhoto);
      return previewPath;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPhotoInfo(photoPath: string): Promise<PhotoInfoType> {
    const imgPath = `${uploadsRoot}/${photoPath}`;
    try {
      const f = sharp(imgPath);
      const meta = await f.metadata();
      const width = meta.width;
      const height = meta.height;
      const ratio = Math.round((height / width) * 100) / 100;
      const dimension = `${meta.width}x${meta.height}`;

      return {
        width,
        height,
        dimension,
        ratio,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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
