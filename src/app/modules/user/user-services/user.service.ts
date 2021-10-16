import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {HeaderRequestEnum} from "../../product/product-constants/header-request-enum";
import {IUser} from "../user-models";
import {UserUrlEnum} from "../user-constans";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(UserUrlEnum.USER)
  }

  getUser(userID: string): Observable<IUser> {
    return this.http.get<IUser>(UserUrlEnum.USER + `/${userID}`);
  }

  getUsersByFilters(userFilter: any): Observable<IUser[]> {
    let params = new HttpParams({fromObject: userFilter})
    return this.http.get<IUser[]>(UserUrlEnum.USER_FILTER, {params: params})
  }

  updateUser(params: Partial<IUser>, userID: Partial<IUser>, token: string): Observable<IUser> {
    const myHeader = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token)
    return this.http.post<IUser>(UserUrlEnum.USER_UPDATE + `/${userID}`, params, {headers: myHeader});
  }

  saveUserPhoto(userPhoto: File, token: string):Observable<Blob> {
    const formData = new FormData();
    formData.append('photo', userPhoto);
    const myHeader = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token)
    return this.http.post(UserUrlEnum.USER_PHOTO, formData, {headers: myHeader, responseType: 'blob'});
  }

  getUserPhoto(user: IUser):Observable<Blob> {
    return this.http.get(UserUrlEnum.USER_PHOTO + `/${user._id}/${user.photo}`, {responseType:'blob'});
  }
}
