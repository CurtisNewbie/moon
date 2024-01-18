import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserInfo } from "src/common/user-info";
import { UserService } from "../user.service";
import { copyToClipboard } from "src/common/clipboard";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit, OnDestroy {
  userInfo: UserInfo = null;
  copyToClipboard = copyToClipboard;

  constructor(private userService: UserService) { }

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
  }

  /** log out current user and navigate back to login page */
  logout(): void {
    this.userService.logout();
  }
}
