import { Paging } from "./paging";

/** Access log response vo*/
export interface AccessLog {
  id: number;
  accessTime: Date;
  success: boolean;
  ipAddress: string;
  username: string;
  url: string;
  userAgent: string;
}

export interface FetchAccessLogList {
  payload: AccessLog[];
  paging: Paging;
}

/**
 * Parameters for fetching list of access log
 */
export interface FetchAccessLogListParam {
  paging: Paging;
}
