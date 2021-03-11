import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { Photo } from "./photo.entity";
import { UserProfile } from "./user-profile.entity";

@Entity()
export class Comment extends AbstractEntity {
  @Column()
  text: string;

  @Column({ nullable: true })
  photo_id: number;

  @ManyToOne(() => Photo, (photo) => photo.comments, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'photo_id' })
  photo: Photo;

  @Column({ nullable: true })
  user_profile_id: number;

  @ManyToOne(() => UserProfile, (user_profile) => user_profile.comments, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'user_profile_id' })
  user_profile: UserProfile;
}