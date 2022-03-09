import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { environment } from 'src/environments/environment';
import { LoginService,UserToken,TokenPermission } from './login.service';
import { List } from '../models/List.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  subdomain: string;
  lists: List[]|undefined = [];
  currentList: any;
  constructor(private apollo: Apollo, private router: Router, private loginService: LoginService) {
    this.subdomain = window.location.host.split('.')[0];
  }

  ngOnInit() {
    console.log("ssfsdf");
    this.checkLoggedIn();
   }
   async checkLoggedIn() {
    if(localStorage.getItem('userToken')!=null)
    { await this.loginService.getListsbyUser().then(
     async (data:List[]) =>{
       this.lists = data;
       this.lists.forEach((element: any) => {
         element.domainName = element.name.toLowerCase().replaceAll(' ', '');
         element.url = `${environment.redirect_protocol}://${element.domainName}.${environment.redirect_domain}`
       }); 
     }
    )}
  }
  async onLogin() {
    
    await this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).then(
      async (data: UserToken) => {
        this.lists = data.lists ? data.lists : [];
        this.lists.forEach((element: any) => {
          element.domainName = element.name.toLowerCase().replaceAll(' ', '');
          element.url = `${environment.redirect_protocol}://${element.domainName}.${environment.redirect_domain}`
        }); 
        if(this.subdomain != environment.redirect_domain){
        this.currentList = this.lists.find((element: any) => { return element.domainName == this.subdomain; });
        if (this.currentList) { await this.loginWithListAccess(this.currentList.id); }
        else{
          throw new Error("User doesnt have access to this list");
        } 
      }
      else{
        this.router.navigate(['home'])}
    }
    ).catch((errors) => {this.router.navigate(['home']);alert(errors); });

  }
  async loginWithListAccess(listId: number) {
    await this.loginService.loginListWithPermission(listId)
      .then(
        async (data: TokenPermission) => {
          localStorage.setItem('mainToken', data.token);
          this.router.navigate(['tasks']);
        })
      .catch((errors) => {alert(errors) })
  }
}