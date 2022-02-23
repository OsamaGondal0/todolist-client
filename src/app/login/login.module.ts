import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache,ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';

const uri = '/graphql';


@NgModule({
  declarations: [
    LoginComponent
  ],
  exports: [
    HttpClientModule,
    ApolloModule,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

})
export class LoginModule {}
