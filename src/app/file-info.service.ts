import { HttpClient, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import {
  UploadFileParam,
} from "src/common/file-info";
import { HClient, getToken } from "src/common/api-util";
import { Resp } from "src/common/resp";

export enum TokenType {
  DOWNLOAD = "DOWNLOAD",
  STREAMING = "STREAMING"
}

@Injectable({
  providedIn: "root",
})
export class FileInfoService {
  constructor(private http: HttpClient, private hclient: HClient) { }

  public uploadToMiniFstore(uploadParam: UploadFileParam): Observable<HttpEvent<any>> {
    let headers = new HttpHeaders()
      .append("fileName", encodeURI(uploadParam.fileName))
      .append("Authorization", getToken())

    return this.http.put<HttpEvent<any>>(
      environment.fstore + "/file",
      uploadParam.files[0],
      {
        observe: "events",
        reportProgress: true,
        withCredentials: true,
        headers: headers,
      }
    );
  }

  public generateFileTempToken(fileKey: string, tokenType: TokenType = TokenType.DOWNLOAD): Observable<Resp<string>> {
    return this.hclient.post<string>(
      environment.vfm, "/file/token/generate",
      { fileKey: fileKey, tokenType: tokenType },
    );
  }

  public jumpToDownloadUrl(fileKey: string): void {
    this.generateFileTempToken(fileKey).subscribe({
      next: (resp) => {
        const token = resp.data;
        const url = environment.fstore + "/file/raw?key=" + encodeURIComponent(token);
        window.open(url, "_parent");
      },
    });
  }
}
