import { Component, OnInit } from '@angular/core';

import { HClient } from 'src/common/api-util';
import { UserService } from '../user.service';
import { Toaster } from '../notification.service';
import { environment } from 'src/environments/environment';
import { PagingController } from 'src/common/paging';
import { ConfirmDialogComponent } from '../dialog/confirm/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlatformNotificationService } from '../platform-notification.service';

export interface Notification {
  id: number,
  notifiNo: string,
  title: string,
  message: string,
  status: string
  createTime: Date
}

@Component({
  selector: 'app-list-notification',
  templateUrl: './list-notification.component.html',
  styleUrls: ['./list-notification.component.css']
})
export class ListNotificationComponent implements OnInit {
  readonly columns: string[] = [
    "id",
    "notifiNo",
    "title",
    "status",
    "createTime",
  ];
  query = {
    onlyInitMessage: true,
  }
  pagingController: PagingController;
  data: Notification[] = []

  constructor(
    private http: HClient,
    private userService: UserService,
    private toaster: Toaster,
    private dialog: MatDialog,
    private platformNotification: PlatformNotificationService,
  ) { }

  ngOnInit(): void {
    this.userService.fetchUserInfo();
  }

  fetchList() {
    this.http
      .post<any>(
        environment.postbox, "/open/api/v1/notification/query",
        {
          status: this.query.onlyInitMessage ? "INIT" : "",
          page: this.pagingController.paging,
        }, false
      )
      .subscribe((resp) => {
        if (resp.data) {
          this.data = [];
          if (resp.data.payload) {
            for (let r of resp.data.payload) {
              if (r.createTime) r.createTime = new Date(r.createTime);
              this.data.push(r);
            }
          }
          this.pagingController.onTotalChanged(resp.data.pagingVo);
        }
      });
  }

  reset() {
    this.pagingController.firstPage();
    this.query = {
      onlyInitMessage: true,
    };
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchList();
    this.fetchList();
  }

  markOpened(notifiNo: string) {
    this.http
      .post<any>(
        environment.postbox, "/open/api/v1/notification/open",
        { notifiNo: notifiNo, }, false
      ).subscribe({
        complete: () => {
          this.platformNotification.triggerChange();
        }
      });
  }

  showNotification(n: Notification) {
    let timeStr = "";
    if (n.createTime) {
      timeStr = n.createTime.toISOString().split('.')[0].replace("T", "");
    }
    const dialogRef: MatDialogRef<ConfirmDialogComponent, boolean> =
      this.dialog.open(ConfirmDialogComponent, {
        width: "700px",
        data: {
          title: n.title,
          msg: [`Time: ${timeStr}`, n.message],
        },
      });

    dialogRef.afterOpened().subscribe(() => {
      if (n.status != 'OPENED') {
        this.markOpened(n.notifiNo);
      }
    })
    dialogRef.afterClosed().subscribe(() => this.fetchList());
  }

}