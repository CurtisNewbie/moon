import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../navigation.service";
import { Toaster } from "../notification.service";
import { NavType } from "../routes";
import { UserService } from "../user.service";
import { setToken, getToken } from "src/common/api-util";

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
    private toaster: Toaster
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
      this.toaster.toast("Please enter username and password");
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
