import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatDialogModule } from '@angular/material/dialog';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [
    HomeComponent,NotificationComponent
  ],
  exports:[HomeComponent],
  imports: [
    HomeRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule
  ]
})
export class HomeModule { }
