import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {forkJoin, Observable} from "rxjs";

import {CategoryService} from "../category-services";

@Injectable({
  providedIn: 'root'
})

export class GetCategoriesResolverService implements Resolve<any> {

  constructor(private categoryService: CategoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
   const  categories = this.categoryService.getCategories();
   const  subCategories = this.categoryService.getSubCategories();
   const  subSubCategories = this.categoryService.getSubSubCategories();

    return forkJoin([
      categories,
      subCategories,
      subSubCategories
    ])
  }
}
