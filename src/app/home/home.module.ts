import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HomeComponent
  ],
  exports:[HomeComponent],
  imports: [
    HomeRoutingModule,
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class HomeModule { }
