import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductComponent} from "./product-components/product/product.component";
import {GetProductsResolverService} from "./product-resolvers/get-products-resolver.service";
import {ProductHomeComponent} from "./product-components/product-home/product-home/product-home.component";
import {ProductCreateComponent} from "./product-components/product-create/product-create.component";
import {ProductEditComponent} from "./product-components/product-edit/product-edit.component";

const routes: Routes = [
  // {path: '', component: ProductComponent, resolve: {data: GetProductsResolverService}},
  {path: '', component: ProductHomeComponent, resolve: {data: GetProductsResolverService}},
  {path: 'create', component: ProductCreateComponent},
  {path: 'edit', component: ProductEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
