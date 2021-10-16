import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {IProduct} from "../product-models";
import {ProductService} from "../product-services";
import {forkJoin, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GetProductsResolverService implements Resolve<IProduct[]> {

  constructor(private productService: ProductService) {
  }

  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProduct[]> | Promise<IProduct[]> | IProduct[] {
  //  return  this.productService.getProducts();
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const categories = this.productService.getCategories();
    const subCategories = this.productService.getSubCategories();
    const subSubCategories = this.productService.getSubSubCategories();
    const products = this.productService.getProducts();
    return forkJoin([
      categories,
      subCategories,
      subSubCategories,
      products
      ])
  }
}
