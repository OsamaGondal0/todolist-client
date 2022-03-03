import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TasksComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class TasksModule { }
