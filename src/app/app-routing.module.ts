import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FileTaskComponent } from "./file-task/file-task.component";
import { FolderComponent } from "./folder/folder.component";
import { FsGroupComponent } from "./fs-group/fs-group.component";
import { GalleryImageComponent } from "./gallery-image/gallery-image.component";
import { GalleryComponent } from "./gallery/gallery.component";
import { MngFilesComponent } from "./manage-files/mng-files.component";
import { ImageViewerComponent } from "./image-viewer/image-viewer.component";
import { LoginComponent } from "./login/login.component";
import { MediaStreamerComponent } from "./media-streamer/media-streamer.component";
import { PdfViewerComponent } from "./pdf-viewer/pdf-viewer.component";
import { NavType } from "./routes";
import { TxtViewerComponent } from "./txt-viewer/txt-viewer.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { ManageKeysComponent } from "./manage-keys/manage-keys.component";
import { ManageRoleComponent } from "./manage-role/manage-role.component";
import { ManagerUserComponent } from "./manager-user/manager-user.component";
import { AccessLogComponent } from "./access-log/access-log.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { OperateHistoryComponent } from "./operate-history/operate-history.component";
import { ManageTasksComponent } from "./manage-tasks/manage-tasks.component";
import { TaskHistoryComponent } from "./task-history/task-history.component";
import { RegisterComponent } from "./register/register.component";
import { ManageResourcesComponent } from "./manage-resources/manage-resources.component";
import { ManagePathsComponent } from "./manage-paths/manage-paths.component";
import { ManageLogsComponent } from "./manage-logs/manage-logs.component";
import { ManageBookmarksComponent } from "./manage-bookmarks/manage-bookmarks.component";
import { ListNotificationComponent } from "./list-notification/list-notification.component";

const routes: Routes = [
  {
    path: NavType.MANAGE_FILES,
    component: MngFilesComponent,
  },
  {
    path: NavType.LOGIN_PAGE,
    component: LoginComponent,
  },
  {
    path: NavType.FILE_TASK,
    component: FileTaskComponent,
  },
  {
    path: NavType.MANAGE_FSGROUP,
    component: FsGroupComponent,
  },
  {
    path: NavType.PDF_VIEWER,
    component: PdfViewerComponent,
  },
  {
    path: NavType.IMAGE_VIEWER,
    component: ImageViewerComponent,
  },
  {
    path: NavType.GALLERY,
    component: GalleryComponent,
  },
  {
    path: NavType.GALLERY_IMAGE,
    component: GalleryImageComponent,
  },
  {
    path: NavType.FOLDERS,
    component: FolderComponent,
  },
  {
    path: NavType.MEDIA_STREAMER,
    component: MediaStreamerComponent,
  },
  {
    path: NavType.TXT_VIEWER,
    component: TxtViewerComponent,
  },
  {
    path: NavType.MANAGE_KEYS,
    component: ManageKeysComponent,
  },
  {
    path: NavType.LOGIN_PAGE,
    component: LoginComponent,
  },
  {
    path: NavType.USER_DETAILS,
    component: UserDetailComponent,
  },
  {
    path: NavType.MNG_ROLES,
    component: ManageRoleComponent,
  },
  {
    path: NavType.MANAGE_USER,
    component: ManagerUserComponent,
  },
  {
    path: NavType.ACCESS_LOG,
    component: AccessLogComponent,
  },
  {
    path: NavType.CHANGE_PASSWORD,
    component: ChangePasswordComponent,
  },
  // {
  //   path: NavType.OPERATE_HISTORY,
  //   component: OperateHistoryComponent,
  // },
  {
    path: NavType.MANAGE_TASKS,
    component: ManageTasksComponent,
  },
  {
    path: NavType.TASK_HISTORY,
    component: TaskHistoryComponent,
  },
  {
    path: NavType.REGISTER_PAGE,
    component: RegisterComponent,
  },
  {
    path: NavType.MNG_PATHS,
    component: ManagePathsComponent,
  },
  {
    path: NavType.MNG_RES,
    component: ManageResourcesComponent,
  },
  {
    path: NavType.MNG_LOGS,
    component: ManageLogsComponent,
  },
  {
    path: NavType.MNG_BOOKMARKS,
    component: ManageBookmarksComponent,
  },
  {
    path: NavType.LIST_NOTIFICATION,
    component: ListNotificationComponent,
  },
  { path: "**", redirectTo: "/" + NavType.USER_DETAILS},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
