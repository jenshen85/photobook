import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionEnum, CommentRoI, LikeRoI, PhotoRoI, SpriteIconEnum, UserProfileRoI } from '@photobook/data';
import { DialogRef, DIALOG_DATA } from '@photobook/ui';

import { PhotobookService } from '../../../photobook/photobook.service';
import { fadeAnimations } from '../../utils/animations';
import { userName } from '../../utils/utils';

export type openPhotoInDataType = {
  photo: PhotoRoI;
  authUserProfile: UserProfileRoI;
  photoUserProfile: UserProfileRoI;
  album_id?: number;
}

@Component({
  selector: 'photobook-photo-view',
  templateUrl: './photo-view.component.html',
  styleUrls: ['./photo-view.component.scss'],
  host: { class: 'photobook-photo-view' },
  animations: [ fadeAnimations.fadeIn() ],
})
export class PhotoViewComponent implements OnInit {
  @Output() updateComments: EventEmitter<{
    comment?: CommentRoI,
    comment_id?: number,
    action: ActionEnum
  }> = new EventEmitter();
  @Output() updateLikes: EventEmitter<{
    like: LikeRoI,
    photo_id: number,
    action: ActionEnum
  }> = new EventEmitter();

  photo: PhotoRoI;
  authUserProfile: UserProfileRoI;
  photoUserProfile: UserProfileRoI;
  loadPhoto: boolean;
  moreIcon = SpriteIconEnum.more;
  leftIcon = SpriteIconEnum.arrow_left;
  rightIcon = SpriteIconEnum.arrow_right;
  removeIcon = SpriteIconEnum.delete;
  editIcon = SpriteIconEnum.edit;
  closeIcon = SpriteIconEnum.close;
  sendIcon = SpriteIconEnum.send;
  heartIcon = SpriteIconEnum.heart_stroke;
  likeIcon = SpriteIconEnum.heart;

  comments: CommentRoI[] = [];

  form: FormGroup;
  pendingComments: boolean;
  likePending: boolean;
  activeActions: number | null = null;
  editComment: number | null = null;

  @ViewChild('commentControl') commentControl: ElementRef;

  constructor(
    private readonly _photobookService: PhotobookService,
    private readonly dialogRef: DialogRef<PhotoViewComponent>,
    @Inject(DIALOG_DATA) private data: openPhotoInDataType
  ) {}

  ngOnInit(): void {
    this.authUserProfile = this.data.authUserProfile;
    this.photoUserProfile = this.data.photoUserProfile;
    this.form = new FormGroup({
      text: new FormControl(null, [Validators.maxLength(200)])
    })

    this.loadPhoto = true;
    this._photobookService.getPhoto(this.data.photo.id).subscribe({
      next: (photo: PhotoRoI) => this.updatePhotoData(photo),
      error: (err) => {
        this.loadPhoto = false;
      }
    });
  }

  prevPhoto() {
    const album_id = this.data.album_id;
    this.loadPhoto = true;
    this._photobookService.getPrevPhoto(this.photo.id, album_id).subscribe({
      next: (photo: PhotoRoI) => this.updatePhotoData(photo),
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  nextPhoto() {
    const album_id = this.data.album_id;
    this.loadPhoto = true;
    this._photobookService.getNextPhoto(this.photo.id, album_id).subscribe({
      next: (photo: any) => this.updatePhotoData(photo),
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  updatePhotoData(photo: PhotoRoI) {
    if(photo) {
      this.photo = photo;
      this.photoUserProfile = photo.user_profile;
      this.getComments();
    } else {
      this.loadPhoto = false;
    }
  }

  likePhotoHandler() {
    if(!this.isUserLike) {
      this.likePending = true;
      this._photobookService.likePhoto(this.photo.id).subscribe({
        next: (like) => {
          this.photo.likes.push(like);
          this.updateLikes.emit({
            like,
            photo_id: this.photo.id,
            action: ActionEnum.update
          });

          this.likePending = false;
        },
        error: () => {
          this.likePending = false;
        }
      });
    } else {
      this.likePending = true;
      this._photobookService.unLikePhoto(this.photo.id).subscribe({
        next: () => {
          const index = this.photo.likes.findIndex(like => like.user_profile_id === this.authUserProfile.id);
          const like = this.photo.likes.splice(index, 1)[0];
          this.updateLikes.emit({
            like,
            photo_id: this.photo.id,
            action: ActionEnum.delete
          });

          this.likePending = false;
        },
        error: () => {
          this.likePending = false;
        }
      });
    }
  }

  get isUserLike(): boolean {
    return Boolean(this.photo.likes.find(like => like.user_profile_id === this.authUserProfile.id ));
  }

  getComments() {
    this.pendingComments = true;
    this._photobookService.getAllComments(this.photo.id)
      .subscribe({
        next: (comments) => {
          this.comments = comments;
          this.pendingComments = false;
        },
        error: (err) => {
          this.pendingComments = false;
        }
      });
  }

  createComment() {
    if (this.form.valid && this.form.value.text) {
      this.pendingComments = true;
      this._photobookService.createComment(this.form.value, this.photo.id)
        .subscribe({
          next: (comment) => {
            this.comments.push(comment);
            this.form.get('text').setValue(null);
            this.updateComments.emit({ comment, action: ActionEnum.create });
            this.pendingComments = false;
          },
          error: (err) => {
            this.pendingComments = false;
          }
        });
    } else {
      this.commentControl.nativeElement.focus();
    }
  }

  updateComment(comment: CommentRoI) {
    if(comment.text.length) {
      this._photobookService.updateComment({text: comment.text}, comment.id)
        .subscribe({
          next: (comment) => {
            this.pendingComments = false;
            this.updateComments.emit({ comment, action: ActionEnum.update });
            this.editComment = null;
          },
          error: (err) => {
            this.pendingComments = false;
          }
        });
    }
  }

  removeComment(comment_id: number) {
    this.pendingComments = true;
    this._photobookService.removeComment(comment_id)
      .subscribe({
        next: () => {
          const index = this.comments.findIndex(comment => comment.id === comment_id);
          const comment = this.comments.splice(index, 1)[0];
          this.updateComments.emit({ comment, comment_id, action: ActionEnum.delete });
          this.pendingComments = false;
        },
        error: (err) => {
          this.pendingComments = false;
        }
      });
  }

  onEditClick(i: number | null) {
    this.editComment = i;
  }

  userNameCalc(first_name: string, last_name: string): string {
    return userName({ first_name, last_name });
  }

  get userName(): string {
    const { first_name, last_name } = this.photoUserProfile;
    return userName({ first_name, last_name });
  }

  get authUserName(): string {
    const { first_name, last_name } = this.authUserProfile;
    return userName({ first_name, last_name });
  }

  get photoDate(): Date {
    return this.photo.created_at;
  }

  get likesLength() {
    return this.photo.likes.length
  }

  onloadImage(_: Event) {
    this.loadPhoto = false;
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
