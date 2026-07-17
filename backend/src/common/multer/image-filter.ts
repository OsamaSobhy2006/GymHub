import { BadRequestException } from '@nestjs/common';

export const imageFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  const allowedExtensions = /\.(jpg|jpeg|png|webp)$/i;

  if (!allowedExtensions.test(file.originalname)) {
    return callback(
      new BadRequestException(
        'Only JPG, JPEG, PNG and WEBP images are allowed',
      ),
      false,
    );
  }

  callback(null, true);
};