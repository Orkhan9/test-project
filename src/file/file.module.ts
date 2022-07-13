import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { AppConfigService } from '../utils/app-config.service';
import { UtilsModule } from '../utils/utils.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UtilsModule, ConfigModule],
  controllers: [FileController],
  providers: [FileService, AppConfigService],
})
export class FileModule {}
