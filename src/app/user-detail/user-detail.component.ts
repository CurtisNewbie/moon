import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { NavigationService} from "../navigation.service";
import { UserService } from "../user.service";
import { HClient } from "src/common/api-util";
import { NavType } from "../routes";

export interface UserDetail {
  id?: string;
  username?: string;
  userNo?: string;
  role?: string; // deprecated
  roleNo?: string;
  roleName?: string;
  registerDate?: string;
}

@Component({
  selector: "app-user-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.css"],
})
export class UserDetailComponent implements OnInit {
  userDetail: UserDetail = {};
  constructor(
    private userService: UserService,
    private nav: NavigationService,
    private http: HClient
  ) { }

  ngOnInit() {
    this.userService.fetchUserInfo();
    this.http.get<any>(
      environment.authService, "/user/info",
    ).subscribe({
      next: (resp) => {
        if (resp.data) {
          if (resp.data.registerDate) resp.data.registerDate = new Date(resp.data.registerDate);
        }
        this.userDetail = resp.data;
      },
    });
  }

  navToChangePassword() {
    this.nav.navigateTo(NavType.CHANGE_PASSWORD);
  }
}
