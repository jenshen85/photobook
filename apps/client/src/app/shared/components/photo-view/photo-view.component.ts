import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommentRoI, PhotoRoI, SpriteIconEnum, UserProfileRoI } from '@photobook/data';
import { DialogRef, DIALOG_DATA } from '@photobook/ui';

import { PhotobookService } from '../../../photobook/photobook.service';
import { fadeAnimations } from '../../utils/animations';
import { userName } from '../../utils/utils';

export type openPhotoInDataType = {
  photo: PhotoRoI;
  authUserProfile: UserProfileRoI;
  photoUserProfile: UserProfileRoI;
}

@Component({
  selector: 'photobook-photo-view',
  templateUrl: './photo-view.component.html',
  styleUrls: ['./photo-view.component.scss'],
  host: { class: 'photobook-photo-view' },
  animations: [ fadeAnimations.fadeIn() ],
})
export class PhotoViewComponent implements OnInit {
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

  comments: CommentRoI[] = [];
  loadComments: boolean;

  form: FormGroup;
  pendingComments: boolean;
  activeActions: number | null = null;
  editComment: number | null = null;

  @ViewChild('commentControl') commentControl: ElementRef;

  constructor(
    private readonly _photobookService: PhotobookService,
    private readonly dialogRef: DialogRef<PhotoViewComponent>,
    @Inject(DIALOG_DATA) private data: openPhotoInDataType
  ) {}

  ngOnInit(): void {
    this.photo = this.data.photo;
    this.authUserProfile = this.data.authUserProfile;
    this.photoUserProfile = this.data.photoUserProfile;
    this.loadPhoto = true;

    this.form = new FormGroup({
      text: new FormControl(null, [Validators.maxLength(200)])
    })

    this.getComments();
  }

  getComments() {
    this._photobookService.getAllComments(this.photo.id)
      .subscribe({
        next: (comments) => {
          this.comments = comments;
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
            this.editComment = null;
          },
          error: (err) => {
            this.pendingComments = false;
          }
        });
    }
  }

  removeComment(comment_id: number) {
    this._photobookService.removeComment(comment_id)
        .subscribe({
          next: () => {
            const index = this.comments.findIndex(comment => comment.id === comment_id);
            this.comments.splice(index, 1);
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
    return userName({ first_name, last_name});
  }

  get userName(): string {
    return userName({ first_name: this.photoUserProfile.first_name, last_name: this.photoUserProfile.last_name});
  }

  get authUserName(): string {
    return userName({ first_name: this.authUserProfile.first_name, last_name: this.authUserProfile.last_name});
  }

  get photoDate(): Date {
    return this.photo.created_at;
  }

  onload(_: Event) {
    this.loadPhoto = false;
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
