import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {UserComponent} from "./user-components";
import {UserEditComponent} from "./user-components";
import {UserResolverService} from "./user-resolvers";

const routes: Routes = [
  {path: '', component: UserComponent, resolve: {data: UserResolverService}},
  {path:'edit', component:UserEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
