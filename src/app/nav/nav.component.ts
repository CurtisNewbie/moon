import { Component, OnDestroy, OnInit } from "@angular/core";
import { getLLang, LLang, onLangChange, setLLang, translate } from "src/models/translate";
import { UserInfo } from "src/models/user-info";
import { UserService } from "../user.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit, OnDestroy {
  userInfo: UserInfo = null;
  lang: LLang = getLLang();
  i18n = translate;
  onLangChangeSub = onLangChange.subscribe({
    next: (e) => {
      this.lang = e.lang;
    }
  });

  constructor(private userService: UserService) { }

  ngOnDestroy(): void {
    this.onLangChangeSub.unsubscribe();
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
      }});
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

  changeLang() {
    this.lang = this.lang == LLang.EN ? LLang.CN : LLang.EN;
    setLLang(this.lang);
  }
}
