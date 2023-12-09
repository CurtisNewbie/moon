import { Paging } from "./paging";

/** Access log response vo*/
export interface AccessLog {
  id: number;

  /** when the user signed in */
  accessTime: Date;

  /** ip address */
  ipAddress: string;

  /** username */
  username: string;

  /** url */
  url: string;

  userAgent: string;
}

export interface FetchAccessLogList {
  /** list of access log */
  payload: AccessLog[];

  /** paging */
  pagingVo: Paging;
}

/**
 * Parameters for fetching list of access log
 */
export interface FetchAccessLogListParam {
  pagingVo: Paging;
}
