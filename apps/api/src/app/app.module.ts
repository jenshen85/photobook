import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { AlbumModule } from './album/album.module';
import { PhotoModule } from './photo/photo.module';
import { FileModule } from './file/file.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';

const environment = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
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
    UserProfileModule,
    AlbumModule,
    PhotoModule,
    FileModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
