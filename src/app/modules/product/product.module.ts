import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product-components/product/product.component';
import {MatToolbarModule} from "@angular/material/toolbar";


@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,

    MatToolbarModule
  ]
})
export class ProductModule { }
