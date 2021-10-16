import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductComponent} from "./product-components/product/product.component";
import {GetProductsResolverService} from "./product-resolvers";
import {ProductHomeComponent} from "./product-components";
import {ProductCreateComponent} from "./product-components";
import {ProductEditComponent} from "./product-components";
import {AppComponent} from "../../app-components";

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
