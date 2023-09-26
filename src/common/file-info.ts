import { Paging } from "./paging";
import { Option } from "./select-util";
import { translate } from "./translate";

export interface FileInfo {
  /**
   * file's id
   */
  id: number;
  /**
   * uuid
   */
  uuid: string;
  /**
   * fileName
   */
  name: string;

  /** name of uploader */
  uploaderName: string;

  /** upload time */
  uploadTime: Date;

  /**
   * size in bytes
   */
  sizeInBytes: number;

  /**
   * File Type
   */
  fileType: FileType;

  /** Update time */
  updateTime: Date;

  /*
    ---------------------------

    Used by frontend only
    ---------------------------
  */

  /** Label for File Type */
  fileTypeLabel: string;

  /** Label for size */
  sizeLabel: string;

  /**
   * whether file is selected
   */
  _selected: boolean;

  /**
   * whether fileType == 'FILE'
   */
  isFile: boolean;

  /**
   * whether fileType == 'DIR'
   */
  isDir: boolean;

  parentFileName?: string;

  isDisplayable: boolean;
}

export enum FileType {
  /** File */
  FILE = "FILE",
  /** Directory */
  DIR = "DIR"
}

const fileTypeTransMap: Map<FileType, string> = new Map<FileType, string>()
  .set(FileType.FILE, "File")
  .set(FileType.DIR, "Directory");

/** Translate FileType */
export function transFileType(ft: FileType): string {
  return fileTypeTransMap.get(ft);
}

export function getFileTypeOpts(includesAll: boolean = true): Option<FileType>[] {
  let l = [];
  if (includesAll) l.push({ name: translate("all"), value: null });

  l.push({ name: translate("file"), value: FileType.FILE });
  l.push({ name: translate("dir"), value: FileType.DIR });
  return l;
}


/** Brief info for DIR type file */
export interface DirBrief {
  id: number;
  uuid: string;
  name: string;
}

/** Parameters used for fetching list of file info */
export interface SearchFileInfoParam {
  /** filename */
  name?: string;
  /** name of tag */
  tagName?: string;
  /** folder no */
  folderNo?: string;
  /** parent file UUID */
  parentFile?: string;
  /** fileType */
  fileType?: FileType;
}

/** Parameters for uploading a file */
export interface UploadFileParam {
  /** name of the file */
  fileName?: string;
  /** file */
  files?: File[];
  /** tags */
  tags?: string[];
  /** parent file uuid */
  parentFile?: string;
  /** ignore on duplicate name */
  ignoreOnDupName?: boolean;
}

/** Parameters for fetching list of file info */
export interface FetchFileInfoListParam {
  /** filename */
  filename?: string;
  /** paging  */
  pagingVo?: Paging;
  /** tagName */
  tagName?: string;
  /** folder no */
  folderNo?: string;
  /** parent file UUID */
  parentFile?: string;
}

/**
 * Empty object with all properties being null values
 */
export function emptyUploadFileParam(): UploadFileParam {
  return {
    files: [],
    fileName: null,
    tags: [],
  };
}

export interface FileAccessGranted {
  /** id of this file_sharing record */
  id: number;
  /** id of user */
  userId?: number;
  /* userNo */
  userNo?: string;
  /** user who is granted access to this file*/
  username: string;
  /** the date that this access is granted */
  createDate: Date;
  /** the access is granted by */
  createdBy: string;
}

export interface Tag {
  id: number;

  /** name of tag */
  name: string;

  /** when the record is created */
  createTime: Date;

  /** who created this record */
  createBy: string;
}

export interface ListTagsForFileResp {
  pagingVo: Paging;
  payload: Tag[];
}
