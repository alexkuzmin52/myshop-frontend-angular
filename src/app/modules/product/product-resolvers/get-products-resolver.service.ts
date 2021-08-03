import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {IProduct} from "../product-models/product-interface";
import {ProductService} from "../product-services/product.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GetProductsResolverService implements Resolve<IProduct[]>{

  constructor(private productService: ProductService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProduct[]> | Promise<IProduct[]> | IProduct[] {
   return  this.productService.getProducts();
  }
}
