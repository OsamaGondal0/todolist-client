import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TasksComponent } from "./tasks.component";
import { NavbarFilterComponent } from "../navbar-filter/navbar-filter.component";
const routes: Routes = [
    {
        path: "",
        component: TasksComponent,
        children:[{
            path: "",
           component:NavbarFilterComponent,
            pathMatch: "full"
        },]

    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TasksRoutingModule {}
