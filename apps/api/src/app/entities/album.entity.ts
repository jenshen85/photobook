import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import { User } from './user.entity';
import { Photo } from './photo.entity';

@Entity()
@Unique(['title'])
export class Album extends AbstractEntity {
  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  preview: string;

  @ManyToOne(() => User, (user) => user.albums, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Photo, (photo) => photo.album, { eager: true })
  photos: Photo[];
}
