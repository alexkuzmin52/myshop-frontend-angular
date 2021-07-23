import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {forkJoin, Observable} from "rxjs";

import {CategoryUrlEnum} from "../constants";
import {HeaderRequestEnum} from "../constants";
import {ICategory, ISubCategory, ISubSubCategory} from "../category-models";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  getCategories = (): Observable<ICategory[]> => {
    return this.http.get<ICategory[]>(CategoryUrlEnum.CATEGORY)
  }

  getSubCategories = (): Observable<ISubCategory[]> => {
    return this.http.get<ISubCategory[]>(CategoryUrlEnum.SUB_CATEGORY)
  }

  getSubSubCategories = (): Observable<ISubSubCategory[]> => {
    return this.http.get<ISubSubCategory[]>(CategoryUrlEnum.SUB_SUB_CATEGORY)
  }

  createCategory = (category: ICategory, token: string): Observable<any> => {
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token)
    return this.http.post(CategoryUrlEnum.CATEGORY, category, {headers: myHeaders})
  }

  createSubCategory = (subCategory: ISubCategory, token: string): Observable<any> => {
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token)
    return this.http.post(CategoryUrlEnum.SUB_CATEGORY, subCategory, {headers: myHeaders})

  }

  createSubSubCategory = (subSubCategory: ISubSubCategory, token: string): Observable<any> => {
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token)
    return this.http.post(CategoryUrlEnum.SUB_SUB_CATEGORY, subSubCategory, {headers: myHeaders})

  }

  // addSubCategoryToCategory = (params: {}) => {

  // }
  addSubCategoryToCategory = (param: any, token: string): Observable<any> => {
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token)
    return this.http.put(CategoryUrlEnum.ADD_SUB_CATEGORY_TO_CATEGORY, param, {headers: myHeaders})
  }

  //TODO addSubSubCategoryToSubCategory
  addSubSubCategoryToSubCategory(param: any, token: string) {
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token)
    return this.http.put(CategoryUrlEnum.ADD_SUB_SUB_CATEGORY_TO_SUB_CATEGORY, param, {headers: myHeaders})
  }


  getCategoryPhoto = (categoryID: number): Observable<Blob> => {
    return this.http.get(CategoryUrlEnum.GET_CATEGORY_PHOTO + `/${categoryID}`, {responseType: 'blob'});
  }
  getSubCategoryPhoto =(subCategoryID: number): Observable<Blob> =>  {
    return this.http.get(CategoryUrlEnum.GET_SUB_CATEGORY_PHOTO + `/${subCategoryID}`, {responseType: 'blob'});

  }


  addFileCategory =  (fileListElement: File, id: number, token: string): Observable<any> => {
    const formData = new FormData();
    formData.append('file', fileListElement);
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token);
    return  this.http.post(CategoryUrlEnum.GET_CATEGORY_PHOTO + `/${id}`, formData, {headers: myHeaders})
  }

}
