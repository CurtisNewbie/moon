import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HClient } from 'src/common/api-util';
import { ConfirmDialog } from 'src/common/dialog';
import { NotificationService } from '../notification.service';
import { filterAlike } from 'src/common/select-util';
import { GalleryBrief } from 'src/common/gallery';
import { environment } from 'src/environments/environment';

type GlFile = {
  fileKey: string
  name: string
  type: string
}

type Data = {
  files: GlFile[]
}

@Component({
  selector: 'app-host-on-gallery',
  templateUrl: './host-on-gallery.component.html',
  styleUrls: ['./host-on-gallery.component.css']
})
export class HostOnGalleryComponent implements OnInit {

  /** list of brief info of all galleries that we created */
  galleryBriefs: GalleryBrief[] = [];
  /** name of fantahsea gallery that we may transfer files to */
  addToGalleryName: string = null;
  /** Auto complete for fantahsea gallery that we may transfer files to */
  autoCompAddToGalleryName: string[];

  onAddToGalleryNameChanged = () => this.autoCompAddToGalleryName = filterAlike(this.galleryBriefs.map(v => v.name), this.addToGalleryName);

  constructor(
    public dialogRef: MatDialogRef<HostOnGalleryComponent, Data>, @Inject(MAT_DIALOG_DATA) public dat: Data,
    private hclient: HClient,
    private confirmDialog: ConfirmDialog,
    private notifi: NotificationService
  ) { }

  ngOnInit(): void {
    this._fetchOwnedGalleryBrief();
  }

  transferSelectedToGallery() {
    const addToGalleryNo = this.extractToGalleryNo()
    if (!addToGalleryNo) return;

    let icnt = this.dat.files.filter(f => f.type == 'FILE').length;
    let dcnt = this.dat.files.length - icnt;

    let msgs = [];
    msgs.push(`You have selected ${icnt} images and ${dcnt} directores.`);
    msgs.push(`All images will transferred and hosted on gallery '${this.addToGalleryName}', it may take a while.`);
    msgs.push("");

    this.confirmDialog.show(`Hosting Images On Fantahsea Gallery '${this.addToGalleryName}'`,
      msgs, () => {
        let params = this.dat.files.map((f) => {
          return {
            fileKey: f.fileKey,
            galleryNo: addToGalleryNo,
          };
        });

        this.hclient
          .post(environment.fantahsea, "/gallery/image/transfer", { images: params, })
          .subscribe({
            complete: () => {
              this.notifi.toast("Request success! It may take a while.");
            },
          });
      })
  }

  private extractToGalleryNo(): string {
    const gname = this.addToGalleryName;
    if (!gname) {
      this.notifi.toast("Please select gallery");
      return;
    }

    let matched: GalleryBrief[] = this.galleryBriefs.filter(v => v.name === gname)
    if (!matched || matched.length < 1) {
      this.notifi.toast("Gallery not found, please check and try again")
      return null;
    }
    if (matched.length > 1) {
      this.notifi.toast("Found multiple galleries with the same name, please try again")
      return null;
    }
    return matched[0].galleryNo
  }

  private _fetchOwnedGalleryBrief() {
    this.hclient.get<GalleryBrief[]>(
      environment.fantahsea, "/gallery/brief/owned",
    ).subscribe({
      next: (resp) => {
        this.galleryBriefs = resp.data;
        this.onAddToGalleryNameChanged();
      }
    });
  }

}
