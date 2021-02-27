import {
  Entity,
  Column,
  Unique,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import { UserProfile } from './user-profile.entity';
// import { User } from './user.entity';
import { Photo } from './photo.entity';

@Entity()
@Unique(['title'])
export class Album extends AbstractEntity {
  @Column({ nullable: true })
  user_id: number;

  @Column({ nullable: true })
  user_profile_id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  preview: string;

  @ManyToOne(() => UserProfile, (user_profile) => user_profile.albums, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'user_profile_id' })
  user_profile: UserProfile;

  @OneToMany(() => Photo, (photo) => photo.album, { eager: true })
  photos: Photo[];
}
