import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ListsComponent } from './lists/lists.component';
import { ListComponent } from './list/list.component';
import { LoginGuard } from './login.guard';
const routes: Routes = [{
  path:'',
  component:LoginComponent
},{
  path:'list/:id',
  component:ListComponent
},{
  path:'lists',
  pathMatch: "full",
  component:ListsComponent,
  canActivate: [LoginGuard]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
