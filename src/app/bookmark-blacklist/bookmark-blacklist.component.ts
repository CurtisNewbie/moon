import { Component, OnInit } from '@angular/core';
import { HClient } from 'src/common/api-util';
import { isEnterKey } from 'src/common/condition';
import { PagingController } from 'src/common/paging';
import { UserService } from '../user.service';
import { Toaster } from '../notification.service';
import { ConfirmDialog } from 'src/common/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bookmark-blacklist',
  templateUrl: './bookmark-blacklist.component.html',
  styleUrls: ['./bookmark-blacklist.component.css']
})
export class BookmarkBlacklistComponent implements OnInit {

  readonly isEnterKeyPressed = isEnterKey;
  readonly tabcol = ['id', 'name', 'operation']

  pagingController: PagingController;
  tabdat = []
  isEnter = isEnterKey;
  file = null;

  searchName = null;
  showUploadPanel = false;

  constructor(private hclient: HClient,
    private userService: UserService,
    private toaster: Toaster,
    private confirmDialog: ConfirmDialog,
  ) { }

  ngOnInit(): void {
    this.userService.fetchUserResources();
    this.userService.fetchUserInfo();
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchList();
    this.fetchList();
  }

  fetchList() {
    this.hclient.post<any>(environment.vfm,
      '/bookmark/blacklist/list', { paging: this.pagingController.paging, name: this.searchName }, false).
      subscribe({
        next: (r) => {
          this.tabdat = r.data.payload;
          this.pagingController.onTotalChanged(r.data.paging);
        }
      });
  }

  popToRemove(id, name) {
    this.confirmDialog.show("Remove Bookmark Blacklist", [`Removing Bookmark Blacklist ${name}`], () => {
      this.remove(id);
    });
  }

  remove(id) {
    this.hclient.post<any>(environment.docindexer,
      '/bookmark/blacklist/remove', { id: id }, false).
      subscribe({
        complete: () => this.fetchList()
      });
  }

  resetSearchName() {
    this.searchName = null;
    this.fetchList();
  }


}
