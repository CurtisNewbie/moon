import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Resp } from "./resp";

const TOKEN = "token";
let emptyTokenCallback = null;
const openApiBasePath = "/open/api";

export function onEmptyToken(callback) {
  emptyTokenCallback = callback;
}

export function buildApiPath(
  subPath: string,
  service: string
): string {
  subPath = subPath.startsWith("/", 0) ? subPath : "/" + subPath;
  return service + openApiBasePath + subPath;
}

export function buildOptions() {
  let token = getToken();
  if (!token) {
    return;
  }
  return {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    }),
    withCredentials: true,
  };
}

export function setToken(token: string) {
  if (token === null) localStorage.removeItem(TOKEN);
  else {
    localStorage.setItem(TOKEN, token);
  }
}

export function getToken() {
  let tkn = localStorage.getItem(TOKEN);
  if (!tkn && emptyTokenCallback) {
    // console.log("No token found, invoking registered onEmptyToken callback");
    emptyTokenCallback();
  }
  return tkn;
}

@Injectable({
  providedIn: 'root'
})
export class HClient {

  constructor(private httpClient: HttpClient) { }

  /** Do POST request */
  post<T>(serviceBase: string, url: string, payload: any, openApiPrefix: boolean = true): Observable<Resp<T>> {
    url = openApiPrefix ? buildApiPath(url, serviceBase) : serviceBase + url;
    console.log("url", url)
    return this.httpClient.post<Resp<T>>(
      url, payload, buildOptions()
    );
  }

  /** Do GET request */
  get<T>(serviceBase: string, url: string, openApiPrefix: boolean = true): Observable<Resp<T>> {
    url = openApiPrefix ? buildApiPath(url, serviceBase) : serviceBase + url;
    return this.httpClient.get<Resp<T>>(url, buildOptions());
  }

}