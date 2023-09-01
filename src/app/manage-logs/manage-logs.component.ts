import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HClient } from 'src/common/api-util';
import { Paging, PagingController } from 'src/common/paging';
import { environment } from 'src/environments/environment';
import { isEnterKey } from 'src/common/condition';

export interface ListedErrorLog {
  id?: number
  node?: string
  app?: string
  caller?: string
  traceId?: string
  spanId?: string
  errMsg?: string
  rtime?: any
}

export interface ListErrorLogReq {
  app?: string
  page?: Paging
}

export interface ListErrorLogResp {
  page: Paging
  payload: ListedErrorLog[]

}

@Component({
  selector: 'app-manage-logs',
  templateUrl: './manage-logs.component.html',
  styleUrls: ['./manage-logs.component.css']
})
export class ManageLogsComponent implements OnInit {

  readonly tabcol = ['rtime', 'app', 'caller', 'errMsg']

  qryApp = '';
  pagingController: PagingController;
  tabdat = []
  isEnter = isEnterKey;

  constructor(private userService: UserService, private hclient: HClient) { }

  ngOnInit(): void {
    this.userService.fetchUserResources();
    this.userService.fetchUserInfo();
  }

  reset() {
    this.qryApp = '';
    this.pagingController.firstPage();
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchList();
    this.fetchList();
  }

  fetchList() {
    this.hclient.post<any>(environment.logbot, '/log/error/list', {
      app: this.qryApp,
      page: this.pagingController.paging
    }, false).subscribe({
      next: (r) => {
        this.tabdat = [];
        if (r.data && r.data.payload) {
          for (let ro of r.data.payload) {
            if (ro.ctime) ro.createTime = new Date(ro.ctime);
            this.tabdat.push(ro);
          }
        }
        this.pagingController.onTotalChanged(r.data.page);
      }
    });
  }

}
