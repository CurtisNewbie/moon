import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../navigation.service";
import { NotificationService } from "../notification.service";
import { NavType } from "../routes";
import { UserService } from "../user.service";
import { setToken, getToken } from "../util/api-util";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  usernameInput: string = "";
  passwordInput: string = "";

  constructor(
    private userService: UserService,
    private nav: NavigationService,
    private notifi: NotificationService
  ) { }

  ngOnInit() {
    if (getToken()) {
      this.userService.fetchUserInfo(() =>
        this.nav.navigateTo(NavType.USER_DETAILS)
      );
    }
  }

  /**
   * login request
   */
  public login(): void {
    if (!this.usernameInput || !this.passwordInput) {
      this.notifi.toast("Please enter username and password");
      return;
    }
    this.userService.login(this.usernameInput, this.passwordInput).subscribe({
      next: (resp) => {
        setToken(resp.data);
        this.routeToHomePage();
        this.userService.fetchUserInfo();
        this.userService.fetchUserResources();
      },
      complete: () => {
        this.passwordInput = "";
      },
    });
  }

  goToRegisterPage(): void {
    this.nav.navigateTo(NavType.REGISTER_PAGE);
  }

  private routeToHomePage(): void {
    this.nav.navigateTo(NavType.USER_DETAILS);
  }

  passwordInputKeyPressed(event: any): void {
    if (event.key === "Enter") {
      this.login();
    }
  }
}
