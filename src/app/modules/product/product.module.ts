import { LOCALE_ID,NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import localRu from '@angular/common/locales/ru-UA'
import {registerLocaleData} from "@angular/common";

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product-components/product/product.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatCardModule} from "@angular/material/card";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatGridListModule} from "@angular/material/grid-list";
import { ProductHomeComponent } from './product-components/product-home/product-home/product-home.component';
import { ProductCreateComponent } from './product-components/product-create/product-create.component';
import { ProductEditComponent } from './product-components/product-edit/product-edit.component';

registerLocaleData(localRu, 'ru')

@NgModule({
  declarations: [
    ProductComponent,
    ProductHomeComponent,
    ProductCreateComponent,
    ProductEditComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatGridListModule

  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'ru'}
  ]
})
export class ProductModule { }
