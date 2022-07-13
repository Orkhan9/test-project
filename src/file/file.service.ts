import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { AppConfigService } from '../utils/app-config.service';
import * as sharp from 'sharp';

@Injectable()
export class FileService {
  constructor(private readonly appConfigService: AppConfigService) {}

  async uploadFile(file: Express.Multer.File) {
    if (file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') {
      throw new HttpException(
        'please send allowed type images',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const sizes = [2048, 1024, 300];

      for (const size of sizes) {
        const resizedBuffer = await sharp(file.buffer)
          .resize(size, size)
          .toBuffer();

        const s3 = new S3();
        const uploadResult = await s3
          .upload({
            Bucket: this.appConfigService.AWS_BUCKET,
            Body: resizedBuffer,
            Key: `${uuid()}-${file.originalname}`,
          })
          .promise();

        console.log(uploadResult.Key);
        console.log(uploadResult.Location);
      }
    } catch (e) {
      console.log(e.message);
    }

    return { message: 'image successfully uploaded' };
  }
}
