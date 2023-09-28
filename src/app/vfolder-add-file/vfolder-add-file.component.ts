import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HClient } from 'src/common/api-util';
import { ConfirmDialog } from 'src/common/dialog';
import { VFolderBrief } from 'src/common/folder';
import { filterAlike } from 'src/common/select-util';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../notification.service';

type VfFile = {
  fileKey: string
  name: string
}

type Data = {
  files: VfFile[]
}

@Component({
  selector: 'app-vfolder-add-file',
  templateUrl: './vfolder-add-file.component.html',
  styleUrls: ['./vfolder-add-file.component.css']
})
export class VfolderAddFileComponent implements OnInit {

  addToVFolderName: string;

  /** list of brief info of all vfolder that we created */
  vfolderBrief: VFolderBrief[] = [];
  /** Auto complete for vfolders that we may add file into */
  autoCompAddToVFolderName: string[];

  constructor(
    public dialogRef: MatDialogRef<VfolderAddFileComponent, Data>, @Inject(MAT_DIALOG_DATA) public dat: Data,
    private hclient: HClient,
    private confirmDialog: ConfirmDialog,
    private notifi: NotificationService
  ) { }

  ngOnInit(): void {
    this.fetchOwnedVFolderBrief();
  }

  onAddToVFolderNameChanged() {
    this.autoCompAddToVFolderName = filterAlike(this.vfolderBrief.map(v => v.name), this.addToVFolderName)
  }

  fetchOwnedVFolderBrief() {
    this.hclient.get<VFolderBrief[]>(
      environment.vfm, "/vfolder/brief/owned",
    ).subscribe({
      next: (resp) => {
        this.vfolderBrief = resp.data;
        this.onAddToVFolderNameChanged();
      }
    });
  }

  addToVirtualFolder() {
    const vfolderName = this.addToVFolderName
    if (!vfolderName) {
      this.notifi.toast("Please select a folder first")
      return
    }

    let addToFolderNo;
    let matched: VFolderBrief[] = this.vfolderBrief.filter(v => v.name === vfolderName)
    if (!matched || matched.length < 1) {
      this.notifi.toast("Virtual Folder not found, please check and try again")
      return
    }
    if (matched.length > 1) {
      this.notifi.toast("Found multiple virtual folder with the same name, please try again")
      return
    }
    addToFolderNo = matched[0].folderNo


    this.confirmDialog.show('Confirm Dialog',
      [`Add these ${this.dat.files.length} files to folder '${this.addToVFolderName}'?`],
      () => {
        this.hclient
          .post(
            environment.vfm, "/vfolder/file/add",
            {
              folderNo: addToFolderNo,
              fileKeys: this.dat.files.map((f) => f.fileKey),
            },
          )
          .subscribe({
            complete: () => {
              this.notifi.toast("Success");
            },
          });
      });
  }
}
