import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { AlbumModule } from './album/album.module';
import { PhotoModule } from './photo/photo.module';
import { FileModule } from './file/file.module';

const environment = process.env.NODE_ENV || 'development';
// console.log('======' + environment + '======');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${environment}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    UserProfileModule,
    AlbumModule,
    PhotoModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
