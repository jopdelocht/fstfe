import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../shared/user.service';

@Injectable({
  providedIn: 'root'
})
export class GametableDeactiveGuardClassGuard implements CanDeactivate<any> {

  constructor(private userService: UserService) { }
  userId = parseInt(localStorage.getItem('userId') ?? '0', 10);;
  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (component) {
      const confirmation = confirm('Are you sure you want to leave this page?');
      if (confirmation) {
        this.userService.removeUserRoleAndGameCode(this.userId);
        return true;
      } else {
        return false;
      }
    }
    return true;
  };
}

