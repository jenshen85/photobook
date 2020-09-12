import * as path from 'path';

export function editFileName(
  file: Express.Multer.File,
  fileName: string
): string {
  return fileName
    ? fileName + path.extname(file.originalname)
    : file.originalname;
}

export function generateFileName(file: Express.Multer.File): string {
  return `${Date.now()}_${path.parse(file.originalname).name}`;
}
