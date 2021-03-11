import { Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Album } from './album.entity';
// import { Auth } from './auth.entity';
import { AbstractEntity } from './abstract-entity';
import { UserProfile } from './user-profile.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
// import { UserProfile } from './user-profile.entity';

@Entity()
export class Photo extends AbstractEntity {
  @Column({ nullable: true })
  user_id: number;

  @Column({ nullable: true })
  album_id: number;

  @Column({ nullable: true })
  user_profile_id: number;

  @Column()
  image: string;

  @Column()
  image_name: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Album, (album) => album.photos, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @ManyToOne(() => UserProfile, (user_profile) => user_profile.photos, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'user_profile_id' })
  user_profile: UserProfile;

  @OneToMany(
    () => Comment,
    (comment) => comment.photo,
    { eager: true }
  )
  comments: Comment[];

  @OneToMany(
    () => Like,
    (like) => like.photo,
    { eager: true }
  )
  likes: Like[];
}
