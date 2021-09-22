import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import localRu from '@angular/common/locales/ru-UA'
import {registerLocaleData} from "@angular/common";

import {ProductRoutingModule} from './product-routing.module';
import {ProductComponent} from './product-components/product/product.component';
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
import {ProductHomeComponent} from './product-components/product-home/product-home/product-home.component';
import {ProductCreateComponent} from './product-components/product-create/product-create.component';
import {ProductEditComponent} from './product-components/product-edit/product-edit.component';
import {ProductFilterChipsComponent} from './product-components/product-filter-chips/product-filter-chips.component';
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
// import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatSliderModule} from "@angular/material/slider";
import {MatTooltipModule} from "@angular/material/tooltip";

registerLocaleData(localRu, 'ru')

@NgModule({
  declarations: [
    ProductComponent,
    ProductHomeComponent,
    ProductCreateComponent,
    ProductEditComponent,
    ProductFilterChipsComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // BrowserAnimationsModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatSliderModule,
    MatTooltipModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'ru'}
  ]
})
export class ProductModule {
}
