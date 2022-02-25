




import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LoginModule } from './login/login.module';
import {Apollo, APOLLO_OPTIONS} from 'apollo-angular'
//import {  HttpLinkModule } from "apollo-angular-link-http";
import { HttpClientModule } from '@angular/common/http';
import {  InMemoryCache } from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import { HttpHeaders } from '@angular/common/http';
import { setContext } from "apollo-link-context";
// import { WebSocketLink } from "apollo-link-ws";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { LoginGuard } from './login.guard';

import { TasksModule } from './tasks/tasks.module';
import {ApolloLink} from '@apollo/client/core';
// import {HttpLink, HttpLinkModule} from 'apollo-angular/http';


  

@NgModule({
    declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
  LoginModule,
    TasksModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        let token = () => {
           return(localStorage.getItem('mainToken')||localStorage.getItem('userToken') || null)};
        const http = httpLink.create({uri: 'http://localhost:4201/graphql'});
        const middleware = new ApolloLink((operation, forward) => {
          if (token()){
            operation.setContext({
              headers: new HttpHeaders().set(
                'Authorization',
                `Bearer ${token()}`
              ),
            });
          }
          return forward(operation);
        });

        const link = middleware.concat(http);

        return {
          link,
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    }, LoginGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule{
  constructor(){}


}