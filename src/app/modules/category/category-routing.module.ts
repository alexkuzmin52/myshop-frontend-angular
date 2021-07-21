import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CategoryComponent} from "./category-components/category/category.component";
import {GetCategoriesResolverService} from "./category-resolvers/get-categories-resolver.service";

const routes: Routes = [
  {path: '', component: CategoryComponent, resolve:{data: GetCategoriesResolverService}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
