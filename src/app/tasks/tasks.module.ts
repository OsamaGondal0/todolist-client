import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksRoutingModule } from './task-routing.module';
import { NavbarFilterComponent } from '../navbar-filter/navbar-filter.component';


@NgModule({
  declarations: [
    TasksComponent,
    NavbarFilterComponent
  ],
  exports:[
    TasksComponent,
    NavbarFilterComponent
  ],
  imports: [
    TasksRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class TasksModule { }
