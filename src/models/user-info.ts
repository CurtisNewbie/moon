export interface UserInfo {
  id: number;
  username: string;
  role: string; // deprecated

  /** whether the user is disabled, 0-normal, 1-disabled */
  isDisabled: number;

  /** review status */
  reviewStatus: string;

  roleNo: string;
  userNo: string;
  roleName: string;
  createTime: Date;
  updateTime: Date;
  updateBy: string;
  createBy: string;
}

/**
 * Parameters for changing password
 */
export interface ChangePasswordParam {
  /**
   * Previous password
   */
  prevPassword: string;

  /**
   * New password
   */
  newPassword: string;
}

/**
 * Empty object with all properties being null values
 */
export function emptyChangePasswordParam(): ChangePasswordParam {
  return {
    prevPassword: null,
    newPassword: null,
  };
}

