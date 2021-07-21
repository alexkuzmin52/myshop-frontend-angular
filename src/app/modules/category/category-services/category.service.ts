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
  URL: string = 'http://localhost:3000/category'

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

  createCategory = (category: ICategory, token:string):Observable<any> => {
    const myHeaders= new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token)
    return this.http.post(CategoryUrlEnum.CATEGORY, category, {headers:myHeaders})
  }

  createSubCategory = (subCategory: ISubCategory, token: string):Observable<any> => {
    const myHeaders= new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token)
    return this.http.post(CategoryUrlEnum.SUB_CATEGORY, subCategory, {headers:myHeaders})

  }

  createSubSubCategory = (subSubCategory: ISubSubCategory, token: string):Observable<any> => {
    const myHeaders= new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token)
    return this.http.post(CategoryUrlEnum.SUB_SUB_CATEGORY, subSubCategory, {headers:myHeaders})

  }

  // addSubCategoryToCategory = (params: {}) => {

  // }
  addSubCategoryToCategory = (param: any, token: string):Observable<any> =>  {
    const myHeaders= new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token)
    return this.http.put(CategoryUrlEnum.ADD_SUB_CATEGORY_TO_CATEGORY, param, {headers:myHeaders})

  }
}
