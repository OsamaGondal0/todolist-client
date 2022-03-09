import { NgModule } from '@angular/core';
import { LoginGuard } from './login.guard';
import { LoggedInGuard } from './loggedIn.guard';
import { LoggedInWithListGuard } from './loggedInWithList.guard';
import { Route, RouterModule } from "@angular/router";




const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: '',
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import("./login/login.module").then((m) => m.LoginModule),
          canActivate:[LoginGuard]
      },
      {
        path: 'home',
        loadChildren: () =>
          import(
            "./home/home.module"
          ).then((m) => m.HomeModule),
          canActivate: [LoggedInGuard]
      },
      {
              path: "tasks",
              loadChildren: () =>
                import("./tasks/tasks.module").then(
                  (m) => m.TasksModule
                ),
              pathMatch: "full",
              canActivate: [LoggedInWithListGuard]
      },
    ]
  }
]
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
