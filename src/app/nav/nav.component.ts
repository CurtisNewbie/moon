import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserInfo } from "src/common/user-info";
import { UserService } from "../user.service";
import { copyToClipboard } from "src/common/clipboard";
import { HClient } from "src/common/api-util";
import { environment } from "src/environments/environment";
import { PlatformNotificationService } from "../platform-notification.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit, OnDestroy {
  userInfo: UserInfo = null;
  copyToClipboard = copyToClipboard;
  unreadCount: 0;

  constructor(
    private userService: UserService,
    private http: HClient,
    private platformNotification: PlatformNotificationService
  ) {
    platformNotification.subscribeChange().subscribe({
      next: () => this.fetchUnreadNotificationCount()
    })
  }

  ngOnDestroy(): void {
  }

  hasRes(code) { return this.userService.hasResource(code); }

  hasAnyRes(...codes: string[]) {
    for (let c of codes) {
      if (this.hasRes(c)) return true;
    }
    return false;
  }

  ngOnInit(): void {
    this.userService.userInfoObservable.subscribe({
      next: (user) => {
        this.userInfo = user;
        if (user) this.userService.fetchUserResources();
      }
    });
    this.userService.isLoggedInObservable.subscribe({
      next: (isLoggedIn) => {
        if (!isLoggedIn) this.userInfo = null;
      },
    });
    this.userService.fetchUserInfo();
    this.fetchUnreadNotificationCount();
  }

  /** log out current user and navigate back to login page */
  logout(): void {
    this.userService.logout();
  }

  fetchUnreadNotificationCount() {
    return this.http.get<any>(environment.postbox, "/open/api/v1/notification/count", false)
      .subscribe({
        next: (res) => this.unreadCount = res.data
      });
  }
}

