import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ActionEnum,
  CommentRoI,
  LikeRoI,
  PhotoRoI,
  SpriteIconEnum,
  UserProfileRoI,
} from '@photobook/data';
import { Dialog, DialogRef, DIALOG_DATA } from '@photobook/ui';
// import { of } from 'rxjs';
// import { catchError } from 'rxjs/operators';
import { ConfirmComponent } from '../../../photobook/components/confirm/confirm.component';

import { PhotobookService } from '../../../photobook/photobook.service';
import { fadeAnimations } from '../../utils/animations';
import { userName } from '../../utils/utils';

export type openPhotoInDataType = {
  photo: PhotoRoI;
  authUserProfile: UserProfileRoI;
  photoUserProfile: UserProfileRoI;
  album_id?: number;
};

@Component({
  selector: 'photobook-photo-view',
  templateUrl: './photo-view.component.html',
  styleUrls: ['./photo-view.component.scss'],
  host: { class: 'photobook-photo-view' },
  animations: [fadeAnimations.fadeIn()],
})
export class PhotoViewComponent implements OnInit {
  @Output() updateComments: EventEmitter<{
    comment?: CommentRoI;
    comment_id?: number;
    action: ActionEnum;
  }> = new EventEmitter();
  @Output() updateLikes: EventEmitter<{
    like: LikeRoI;
    photo_id: number;
    action: ActionEnum;
  }> = new EventEmitter();
  window: Window;
  photo: PhotoRoI;
  data: openPhotoInDataType;
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
  ratio: string = '56%';
  width: string = '100%';

  @ViewChild('commentControl') commentControl: ElementRef;

  constructor(
    private readonly _photobookService: PhotobookService,
    private readonly dialogRef: DialogRef<PhotoViewComponent>,
    private readonly _dialog: Dialog,
    @Inject(DIALOG_DATA) private _data: openPhotoInDataType,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.photo = _data.photo;
    this.window = this.document.defaultView;
  }

  ngOnInit(): void {
    this.authUserProfile = this._data.authUserProfile;
    this.photoUserProfile = this._data.photoUserProfile;
    this.form = new FormGroup({
      text: new FormControl(null, [Validators.maxLength(200)]),
    });

    this.loadPhoto = true;
    this._photobookService.getPhoto(this._data.photo.id).subscribe({
      next: (photo: PhotoRoI) => this.updatePhotoData(photo),
      error: (err) => {
        this.loadPhoto = false;
      },
    });
  }

  prevPhoto() {
    const album_id = this._data.album_id;
    this.loadPhoto = true;
    this._photobookService.getPrevPhoto(this.photo.id, album_id).subscribe({
      next: (photo: PhotoRoI) => this.updatePhotoData(photo),
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  nextPhoto() {
    const album_id = this._data.album_id;
    this.loadPhoto = true;
    this._photobookService
      .getNextPhoto(this.photo.id, album_id)
      .pipe
      // catchError((err, caught) => {
      //   return of(err)
      // })
      ()
      .subscribe({
        next: (photo: any) => this.updatePhotoData(photo),
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  updatePhotoData(photo: PhotoRoI) {
    if (photo) {
      this.photo = photo;
      this.photoUserProfile = photo.user_profile;
      this.getComments();
    } else {
      this.loadPhoto = false;
    }
  }

  likePhotoHandler() {
    if (!this.isUserLike) {
      this.likePending = true;
      this._photobookService.likePhoto(this.photo.id).subscribe({
        next: (like) => {
          this.photo.likes.push(like);
          this.updateLikes.emit({
            like,
            photo_id: this.photo.id,
            action: ActionEnum.update,
          });

          this.likePending = false;
        },
        error: () => {
          this.likePending = false;
        },
      });
    } else {
      this.likePending = true;
      this._photobookService.unLikePhoto(this.photo.id).subscribe({
        next: () => {
          const index = this.photo.likes.findIndex(
            (like) => like.user_profile_id === this.authUserProfile.id
          );
          const like = this.photo.likes.splice(index, 1)[0];
          this.updateLikes.emit({
            like,
            photo_id: this.photo.id,
            action: ActionEnum.delete,
          });

          this.likePending = false;
        },
        error: () => {
          this.likePending = false;
        },
      });
    }
  }

  get isUserLike(): boolean {
    return Boolean(
      this.photo.likes.find(
        (like) => like.user_profile_id === this.authUserProfile.id
      )
    );
  }

  getComments() {
    this.pendingComments = true;
    this._photobookService.getAllComments(this.photo.id).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.pendingComments = false;
      },
      error: (err) => {
        this.pendingComments = false;
      },
    });
  }

  createComment() {
    if (this.form.valid && this.form.value.text) {
      this.pendingComments = true;
      this._photobookService
        .createComment(this.form.value, this.photo.id)
        .subscribe({
          next: (comment) => {
            this.comments.push(comment);
            this.form.get('text').setValue(null);
            this.updateComments.emit({ comment, action: ActionEnum.create });
            this.pendingComments = false;
          },
          error: (err) => {
            this.pendingComments = false;
          },
        });
    } else {
      this.commentControl.nativeElement.focus();
    }
  }

  updateComment(comment: CommentRoI) {
    if (comment.text.length) {
      this._photobookService
        .updateComment({ text: comment.text }, comment.id)
        .subscribe({
          next: (comment) => {
            this.pendingComments = false;
            this.updateComments.emit({ comment, action: ActionEnum.update });
            this.editComment = null;
          },
          error: (err) => {
            this.pendingComments = false;
          },
        });
    }
  }

  removeComment(comment_id: number) {
    const confirm = this._dialog.open(ConfirmComponent, {
      data: {
        title: 'Удалить комментарий',
        message: `Вы действительно хотите удалить комментарий?`,
      },
      isScrolled: true,
      autoFocus: false,
      scrolledOverlayPosition: 'center',
      dialogContainerClass: ['confirm-container'],
    });

    confirm.afterClosed().subscribe((cond) => {
      if (cond) {
        this.removeCommentHandler(comment_id);
      }
    });
  }

  removeCommentHandler(comment_id: number) {
    this.pendingComments = true;
    this._photobookService.removeComment(comment_id).subscribe({
      next: () => {
        const index = this.comments.findIndex(
          (comment) => comment.id === comment_id
        );
        const comment = this.comments.splice(index, 1)[0];
        this.updateComments.emit({
          comment,
          comment_id,
          action: ActionEnum.delete,
        });
        this.pendingComments = false;
      },
      error: (err) => {
        this.pendingComments = false;
      },
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
    return this.photo.likes.length;
  }

  onloadImage(_: Event, photo: PhotoRoI) {
    this.loadPhoto = false;
    this.ratio = photo.ratio * 100 + '%';
    if (photo.height > photo.width || photo.ratio > 0.9) {
      this.width = `${(this.window.innerHeight - 50) / photo.ratio}px`;
    } else {
      this.width = '100%';
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
