import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import { Album } from './album.entity';
import { Auth } from './auth.entity';
// import { Photo } from './photo.entity';
// import { User } from './user.entity';

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

  @Column({ nullable: true })
  user_id: number;

  @OneToOne(
    () => Auth,
    (user) => user.user_profile,
    { onDelete: 'CASCADE', eager: true }
  )
  @JoinColumn({ name: 'user_id' })
  user: Auth;

  @OneToMany(
    () => Album,
    (album) => album.user_profile,
    { onDelete: 'CASCADE', eager: true }
  )
  albums: Album[];

  // // join photos
  // @OneToMany(() => Photo, (photo) => photo.user)
  // photos: Photo[];
}
