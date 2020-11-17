import {
  Entity,
  Unique,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { UserRoleEnum } from '@photobook/data';

import { AbstractEntity } from './abstract-entity';
import { UserProfile } from './user-profile.entity';
import { Album } from './album.entity';
import { Photo } from './photo.entity';

@Entity()
@Unique(['email'])
export class User extends AbstractEntity {
  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.user,
  })
  role: UserRoleEnum;

  // join profile
  @Column({ nullable: true })
  user_profile_id: number;

  @OneToOne(() => UserProfile, { eager: true, cascade: true })
  @JoinColumn({ name: 'user_profile_id' })
  user_profile: UserProfile;

  // join albums
  @OneToMany(() => Album, (album) => album.user, { eager: true })
  albums: Album[];

  // join photos
  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
