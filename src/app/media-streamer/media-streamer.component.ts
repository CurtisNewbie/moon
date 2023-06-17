import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HClient } from '../util/api-util';

export interface MediaStreamerDialogData {
  name: string;
  url: string;
  token: string;
}

@Component({
  selector: 'app-media-streamer',
  templateUrl: './media-streamer.component.html',
  styleUrls: ['./media-streamer.component.css']
})
export class MediaStreamerComponent implements OnInit, OnDestroy {

  name: string;
  token: string;
  srcUrl: string;

  constructor(private http: HClient, public dialogRef: MatDialogRef<MediaStreamerComponent, MediaStreamerDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: MediaStreamerDialogData) { }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.name = this.data.name;
    this.srcUrl = location.protocol + "//" + location.hostname + ":" + location.port + "/" + this.data.url;
    this.token = this.data.token;
  }

}
