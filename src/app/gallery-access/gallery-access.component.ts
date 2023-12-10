import { Component, Inject, OnInit } from '@angular/core';
import { HClient } from 'src/common/api-util';
import { isEnterKey } from 'src/common/condition';
import { PagingController } from 'src/common/paging';
import { NotificationService } from '../notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

export type GalleryAccessGranted = {
  id: number,
  userNo: string,
  createTime: any
}

export interface GrantGalleryAccessDialogData {
  galleryNo: string;
  name: string;
}

@Component({
  selector: 'app-gallery-access',
  templateUrl: './gallery-access.component.html',
  styleUrls: ['./gallery-access.component.css']
})
export class GalleryAccessComponent implements OnInit {
  readonly columns: string[] = [
    "username",
    "createTime",
    "removeButton",
  ];
  grantedTo: string = "";
  grantedAccesses: GalleryAccessGranted[] = [];
  pagingController: PagingController;
  isEnterPressed = isEnterKey;

  constructor(
    private http: HClient,
    private notifi: NotificationService,
    public dialogRef: MatDialogRef<GalleryAccessComponent, GrantGalleryAccessDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: GrantGalleryAccessDialogData
  ) {
  }

  ngOnInit() {

  }

  grantAccess() {
    this.grantFolderAccess();
  }

  grantFolderAccess() {
    if (!this.grantedTo) {
      this.notifi.toast("Enter username first");
      return;
    }

    this.http.post<void>(
      environment.fantahsea, "/gallery/access/grant",
      {
        galleryNo: this.data.galleryNo,
        username: this.grantedTo,
      },
    ).subscribe({
      next: () => {
        this.notifi.toast("Access granted");
        this.fetchAccessGranted();
      },
    });
  }


  fetchAccessGranted() {
    this.fetchFolderAccessGranted();
  }

  fetchFolderAccessGranted() {
    this.http.post<any>(
      environment.fantahsea, "/gallery/access/list",
      {
        galleryNo: this.data.galleryNo,
        pagingVo: this.pagingController.paging,
      },
    ).subscribe({
      next: (resp) => {
        this.grantedAccesses = [];
        if (resp.data.payload) {
          for (let g of resp.data.payload) {
            g.createTime = new Date(g.createTime);
            this.grantedAccesses.push(g);
          }
        }
        this.pagingController.onTotalChanged(resp.data.pagingVo);
      },
    });
  }

  removeAccess(access): void {
    this.removeFolderAccess(access.userNo);
  }

  removeFolderAccess(userNo: string): void {
    this.http.post<void>(
      environment.fantahsea, "/gallery/access/remove",
      { userNo: userNo, galleryNo: this.data.galleryNo },
    ).subscribe({
      next: () => {
        this.fetchAccessGranted();
      },
    });
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchAccessGranted();
    this.fetchAccessGranted();
  }


}
