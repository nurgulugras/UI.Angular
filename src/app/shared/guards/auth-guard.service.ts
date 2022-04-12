import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthToolService } from '../AuthToolService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private authToolService: AuthToolService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authToolService.isLoggedIn();
    // const isLoginForm = route.routeConfig.path == "login";

    // if (isLoginForm) return true;
    if (!isLoggedIn) {
      this.router.navigate(["/auths/login"]);
      return false;
    }

    // const isHomePage = route.routeConfig.path == "home";
    // const isAdmin = this.authToolService.isAdmin();
    // if (!isAdmin && isHomePage) {
    //   this.router.navigate(["/applications"]);
    //   return false;
    // }

    // const expectedRole: UserType[] = route.data.expectedRoles;
    // if (!expectedRole) throw "Routes.data.expectedRole boş geçilemez!";

    // var currentUserRole: number = this.authToolService.getCurrentUser().role;
    // if (expectedRole.indexOf(currentUserRole) < 0) return false;

    return true;
  }
}
