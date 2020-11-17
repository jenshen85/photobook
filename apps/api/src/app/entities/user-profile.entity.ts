import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import { Photo } from './photo.entity';
import { User } from './user.entity';

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

  @OneToOne(() => User, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // join photos
  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];
}
