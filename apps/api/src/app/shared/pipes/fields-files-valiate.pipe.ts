import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FieldsFilesValiatePipe<T> implements PipeTransform {
  constructor(private readonly allowedFields: string[]) {}

  transform(files: T): T {
    const emptyFields = [];

    this.allowedFields.forEach((field) => {
      if (!files[field]) {
        emptyFields.push(field);
      }
    });

    if (emptyFields.length) {
      throw new BadRequestException(
        `Field${emptyFields.length === 1 ? '' : 's'} ${emptyFields.join(
          ', '
        )} is required`
      );
    }

    return files;
  }
}
