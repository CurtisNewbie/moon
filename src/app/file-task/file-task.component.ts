import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PagingController } from 'src/common/paging';
import { UserService } from '../user.service';
import { HClient, buildApiPath } from 'src/common/api-util';
import { time } from 'src/common/date-util';

export interface FileTask {
  taskNo?: string
  type?: string
  status?: string
  description?: string
  fileKey?: string
  startTime?: Date
  endTime?: Date
  remark?: string
  updateTime?: Date
}

@Component({
  selector: 'app-file-task',
  templateUrl: './file-task.component.html',
  styleUrls: ['./file-task.component.css']
})
export class FileTaskComponent implements OnInit {

  readonly titles = ["taskNo", "type", "status", "description", "startTime", "endTime", "remark", "updateTime", "operation"];
  pagingController: PagingController;
  fileTaskList: FileTask[] = [];

  constructor(private hclient: HClient) { }

  ngOnInit(): void {
  }

  fetchFileTaskList() {
    this.hclient.post<any>(environment.vfm, "/file/task/list", this.pagingController.paging)
      .subscribe({
        next: (resp) => {
          this.fileTaskList = [];

          if (!resp.data.payload) return;

          for (let r of resp.data.payload) {
            if (r.startTime) r.startTime = new Date(r.startTime);
            if (r.endTime) r.endTime = new Date(r.endTime);
            if (r.updateTime) r.updateTime = new Date(r.updateTime);
            this.fileTaskList.push(r);
          }

          this.pagingController.onTotalChanged(resp.data.paging);
        }
      })
  }

  // TODO: this doesn't work on vfm
  /**
   * Fetch download url and open it in a new tab
   */
  jumpToDownloadUrl(fileKey: string): void {
    this.hclient.post<string>(
      environment.vfm, "/file/token/generate",
      { fileKey: fileKey, tokenType: "DOWNLOAD" },
    ).subscribe({
      next: (resp) => {
        const token = resp.data;
        const url = buildApiPath("/file/token/download?token=" + token, environment.vfm);
        window.open(url, "_parent");
      },
    });
  }

  onPagingControllerReady(pagingController: PagingController) {
    console.log("onPagingControllerReady", time());
    this.pagingController = pagingController;
    this.pagingController.onPageChanged = () => this.fetchFileTaskList();
    this.fetchFileTaskList();
  }
}
