import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {NotFoundComponent} from "../app-components";
import {MenuComponent} from "../app-components";

const routes: Routes = [
  {path: '', component: MenuComponent},
  {path: 'category', loadChildren: () => import('../modules/category/category.module').then(m => m.CategoryModule)},
  {path: 'product', loadChildren: () => import('../modules/product/product.module').then(m => m.ProductModule)},
  {path: 'user', loadChildren: () => import('../modules/user/user.module').then(m => m.UserModule)},
  {path: '**', component: NotFoundComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
