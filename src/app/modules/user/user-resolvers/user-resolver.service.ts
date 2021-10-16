import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {IUser} from "../user-models";
import {Observable} from "rxjs";

import {UserService} from "../user-services";

@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<IUser[]> {

  constructor(private userService: UserService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUser[]> | any {
    return this.userService.getUsers();
  }
}
