import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductComponent} from "./product-components/product/product.component";
import {GetProductsResolverService} from "./product-resolvers/get-products-resolver.service";

const routes: Routes = [
  {path: '', component: ProductComponent, resolve: {data: GetProductsResolverService}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
