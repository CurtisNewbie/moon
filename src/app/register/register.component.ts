import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../navigation.service";
import { Toaster } from "../notification.service";
import { UserService } from "../user.service";
import { isEnterKey } from "src/common/condition";
import { NavType } from "../routes";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  usernameInput: string = "";
  passwordInput: string = "";
  isEnter = isEnterKey;

  constructor(
    private userService: UserService,
    private notifi: Toaster,
    private nav: NavigationService
  ) { }

  ngOnInit() { }

  register(): void {
    if (!this.usernameInput || !this.passwordInput) {
      this.notifi.toast("Please enter username and password");
      return;
    }
    this.userService
      .register(this.usernameInput, this.passwordInput)
      .subscribe({
        next: () => {
          this.notifi.toast(
            "Registration successful, please wait for administrator's approval"
          );
          this.nav.navigateTo(NavType.LOGIN_PAGE);
        },
        complete: () => {
          this.usernameInput = "";
          this.passwordInput = "";
        },
      });
  }

  gotoLoginPage(): void {
    this.nav.navigateTo(NavType.LOGIN_PAGE);
  }
}
