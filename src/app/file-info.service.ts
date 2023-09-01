import { HttpClient, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import {
  UploadFileParam,
} from "src/common/file-info";
import { getToken } from "src/common/api-util";

@Injectable({
  providedIn: "root",
})
export class FileInfoService {
  constructor(private http: HttpClient) { }

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
}
