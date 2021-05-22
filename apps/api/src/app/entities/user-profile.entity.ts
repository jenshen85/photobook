import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import { Album } from './album.entity';
import { Auth } from './auth.entity';
import { Photo } from './photo.entity';
import { Comment } from './comment.entity';
import { LanguageEnum } from '@photobook/data';

@Entity()
export class UserProfile extends AbstractEntity {
  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  cover: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: LanguageEnum,
    default: LanguageEnum.English,
  })
  language_code: LanguageEnum;

  @Column({ nullable: true })
  user_id: number;

  @OneToOne(() => Auth, (user) => user.user_profile, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: Auth;

  @OneToMany(() => Album, (album) => album.user_profile, {
    onDelete: 'CASCADE',
    eager: false,
  })
  albums: Album[];

  // join photos
  @OneToMany(() => Photo, (photo) => photo.user_profile, {
    onDelete: 'CASCADE',
    eager: true,
  })
  photos: Photo[];

  @OneToMany(() => Comment, (comment) => comment.user_profile, {
    onDelete: 'CASCADE',
    eager: true,
  })
  comments: Comment[];
}
