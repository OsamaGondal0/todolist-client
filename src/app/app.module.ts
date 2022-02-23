import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginModule } from './login/login.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { ListsModule } from './lists/lists.module';
import { ListModule } from './list/list.module';
import { setContext } from '@apollo/client/link/context';
import { LoginGuard } from "./login.guard";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LoginModule,
    ListsModule,
    ListModule,
    ApolloModule,
    HttpClientModule,
    AppRoutingModule,
    
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,

      useFactory: (httpLink: HttpLink) => {
          const token = localStorage.getItem('userToken');
          // return the headers to the context so httpLink can read them
          if (token)
        {console.log('xxxxx',token);
          return {
          cache: new InMemoryCache(),
          link: httpLink.create({ uri: 'http://localhost:4201/graphql',headers: new HttpHeaders({
            "Authorization": `${token}`})})
        };}
        else{
          return {
            cache: new InMemoryCache(),
            link: httpLink.create({ uri: 'http://localhost:4201/graphql'})
          };
        }
      },
      deps: [HttpLink],
    },LoginGuard
  ], bootstrap: [AppComponent]
})
export class AppModule { }