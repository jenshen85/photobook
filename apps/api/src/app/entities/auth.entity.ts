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
// import { Album } from './album.entity';
// import { Photo } from './photo.entity';

@Entity()
@Unique(['email'])
export class Auth extends AbstractEntity {
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

  @Column({ type: 'boolean', default: false })
  has_profile: boolean;

  // join profile
  @Column({ nullable: true })
  user_profile_id: number;

  @OneToOne(() => UserProfile, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_profile_id' })
  user_profile: UserProfile;

  // join albums
  // @OneToMany(() => Album, (album) => album.user, { eager: true })
  // albums: Album[];

  // // join photos
  // @OneToMany(() => Photo, (photo) => photo.user)
  // photos: Photo[];

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
