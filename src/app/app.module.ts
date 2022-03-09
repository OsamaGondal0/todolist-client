




import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import{MatDialog, MatDialogModule} from '@angular/material/dialog' 
import {MatToolbarModule} from '@angular/material/toolbar'
import { LoginModule } from './login/login.module';
import {Apollo, ApolloModule, APOLLO_OPTIONS,gql} from 'apollo-angular'
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
import {WebSocketLink} from '@apollo/client/link/ws';
import {split, ApolloClientOptions} from '@apollo/client/core';
import {getMainDefinition} from '@apollo/client/utilities';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HomeModule } from './home/home.module';

import { TasksModule } from './tasks/tasks.module';
import { NotificationModule } from './notification/notification.module';
import {ApolloLink} from '@apollo/client/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationComponent } from './notification/notification.component';
import { LoggedInWithListGuard } from './loggedInWithList.guard';
import { LoggedInGuard } from './loggedIn.guard';
import { RouterModule } from '@angular/router';
// import {HttpLink, HttpLinkModule} from 'apollo-angular/http';


  

@NgModule({
    declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    MatToolbarModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ApolloModule,
    NotificationModule,
    ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        let token = () => {
           return(localStorage.getItem('mainToken')||localStorage.getItem('userToken') || null)
          };
        const http = httpLink.create({uri: 'http://localhost:4201/graphql'});
        const authLink = new ApolloLink((operation, forward) => {
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

        //WEBSOCKET IMPLEMENTATION===================================================

        // Create a WebSocket link:
        const ws = new WebSocketLink({
          uri: environment.wsSubscriptionUrl,
          options: {
              reconnect: true,
              connectionParams: () => ({
                  authToken: token()
              }),
          },
      });
        // const link = authLink.concat(http);

        const link = split(
          // split based on operation type
          ({query}) => {
            let defination = getMainDefinition(query);
            return (
                defination.kind === "OperationDefinition" &&
                defination.operation === "subscription"
            );
          },
          ws,
          authLink.concat(http),
        );
        return {
          link,
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },LoggedInWithListGuard,LoginGuard,LoggedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule{
  constructor(apollo: Apollo,public dialog: MatDialog) {

  }
}
