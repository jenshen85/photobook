import { LikeEnum } from '@photobook/data';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import { Photo } from './photo.entity';
import { UserProfile } from './user-profile.entity';

@Entity()
export class Like extends AbstractEntity {
  @Column({
    type: 'enum',
    enum: LikeEnum,
    default: LikeEnum.unliked,
  })
  status: LikeEnum;

  @Column({ nullable: true })
  photo_id: number;

  @ManyToOne(() => Photo, (photo) => photo.likes, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'photo_id' })
  photo: Photo;

  @Column({ nullable: true })
  user_profile_id: number;

  @ManyToOne(() => UserProfile, (user_profile) => user_profile.photos, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'user_profile_id' })
  user_profile: UserProfile;
}
