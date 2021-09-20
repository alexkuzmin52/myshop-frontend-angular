import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {AppComponent} from "../app-components/app/app.component";
import {HomeComponent} from "../app-components/home/home.component";
import {NotFoundComponent} from "../app-components/not-found/not-found.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'category', loadChildren: () => import('../modules/category/category.module').then(m => m.CategoryModule)},
  {path: 'product', loadChildren: () => import('../modules/product/product.module').then(m => m.ProductModule)},

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
export class AppRoutingModule {
}
