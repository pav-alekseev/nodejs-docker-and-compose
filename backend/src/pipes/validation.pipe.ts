import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from 'src/exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value === null || value === undefined) {
      return value; // Если значение null или undefined, вернуть его без валидации
    }

    if (typeof value === 'object') {
      for (const key in value) {
        if (value.hasOwnProperty(key) && value[key] === '') {
          delete value[key]; // Удалить поле с пустым значением из объекта
        }
      }
    }

    const obj = plainToClass(metadata.metatype, value);

    const errors = await validate(obj);

    if (errors.length) {
      const message = errors.map((err) => {
        return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
      });

      throw new ValidationException(message);
    }
    return value;
  }
}
