import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HClient, getToken } from 'src/common/api-util';
import { PagingController } from 'src/common/paging';
import { UserService } from '../user.service';
import { isEnterKey } from 'src/common/condition';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Toaster } from '../notification.service';
import { ConfirmDialog } from 'src/common/dialog';

@Component({
  selector: 'app-manage-bookmarks',
  templateUrl: './manage-bookmarks.component.html',
  styleUrls: ['./manage-bookmarks.component.css']
})
export class ManageBookmarksComponent implements OnInit {

  readonly isEnterKeyPressed = isEnterKey;
  readonly tabcol = ['id', 'name', 'operation']

  pagingController: PagingController;
  tabdat = []
  isEnter = isEnterKey;
  file = null;

  searchName = null;
  showUploadPanel = false;

  @ViewChild("uploadFileInput")
  uploadFileInput: ElementRef;

  constructor(private hclient: HClient,
    private userService: UserService,
    private http: HttpClient,
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
    this.hclient.post<any>(environment.docindexer,
      '/bookmark/list', { paging: this.pagingController.paging, name: this.searchName }, false).
      subscribe({
        next: (r) => {
          this.tabdat = r.data.payload;
          this.pagingController.onTotalChanged(r.data.pagingVo);
        }
      });
  }

  upload() {
    if (!this.file) {
      return null;
    }
    this.uploadToTmpFile(this.file).subscribe({
      complete: () => {
        this.file = null;
        this.fetchList();
        if (this.uploadFileInput) {
          this.uploadFileInput.nativeElement.value = null;
        }
        this.toaster.toast("Bookmarks uploaded");
        this.showUploadPanel = false;
      },
    });
  }

  onFileSelected(files: File[]) {
    if (files == null || files.length < 1) {
      this.toaster.toast("Please select file");
      return;
    }
    this.file = files[0];
  }

  popToRemove(id, name) {
    this.confirmDialog.show("Remove Bookmark", [`Removing Bookmark ${name}`], () => {
      this.remove(id);
    });
  }

  remove(id) {
    this.hclient.post<any>(environment.docindexer,
      '/bookmark/remove', { id: id }, false).
      subscribe({
        complete: () => this.fetchList()
      });
  }

  uploadToTmpFile(file: File): Observable<HttpEvent<any>> {
    let headers = new HttpHeaders().append("Authorization", getToken())

    return this.http.put<HttpEvent<any>>(
      environment.docindexer + "/bookmark/file/upload",
      file,
      {
        observe: "events",
        reportProgress: true,
        withCredentials: true,
        headers: headers,
      }
    );
  }

  resetSearchName() {
    this.searchName = null;
    this.fetchList();
  }

}
