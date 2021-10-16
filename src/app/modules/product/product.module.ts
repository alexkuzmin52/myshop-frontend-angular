import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import localRu from '@angular/common/locales/ru-UA'
import {registerLocaleData} from "@angular/common";

import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatChipsModule} from "@angular/material/chips";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatMenuModule} from "@angular/material/menu";
import {MatSelectModule} from "@angular/material/select";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSliderModule} from "@angular/material/slider";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ProductHomeComponent} from './product-components';

import {ProductComponent} from './product-components';
import {ProductCreateComponent} from './product-components';
import {ProductEditComponent} from './product-components';
import {ProductFilterChipsComponent} from './product-components';
import {ProductRoutingModule} from './product-routing.module';

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
