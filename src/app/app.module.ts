import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app-components';
import {AppRoutingModule} from "./app-routing/app-routing.module";
import {NotFoundComponent} from './app-components';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import {MatSidenavModule} from "@angular/material/sidenav";

import {MatDividerModule} from "@angular/material/divider";
import { MenuComponent } from './app-components';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatDividerModule,


  ],
  providers: [],
  exports: [
    MenuComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
