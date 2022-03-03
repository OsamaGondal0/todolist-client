import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  newList = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
  });
  subdomain: string;
  loggedIn: boolean = false;
  lists!: any[];
  userToken: any;
  currentList: any;
  constructor(private apollo: Apollo, private router: Router, private loginService: LoginService) {
    this.subdomain = window.location.host.split('.')[0];
  }

  ngOnInit() {
    this.checkLoggedIn();
   }
   async checkLoggedIn() {
     if(localStorage.getItem('userToken')!=null)
     {this.loggedIn=true;
       await this.loginService.getListsbyUser().then(
      async (data:any) =>{
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
      async (data: any) => {
        this.loggedIn = true;
        this.lists = data.lists;
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
    }
    ).catch(({errors}) => {alert(errors[0].message) });

  }

  async onCreateList() {
    await this.loginService.creatList(this.newList.value.name, this.newList.value.description).then(
      async (data: any) => {
        data.url = `${environment.redirect_protocol}://${data.name.toLowerCase().replaceAll(' ', '')}.${environment.redirect_domain}`        
        this.lists.push(data);
      }
    ).catch(({errors}) => {alert(errors[0].message)  });

  }
  async loginWithListAccess(listId: any) {
    await this.loginService.loginListWithPermission(listId)
      .then(
        async (data: any) => {
          localStorage.setItem('mainToken', data.token);
          this.router.navigate(['tasks']);
        })
      .catch(({errors}) => {alert(errors[0].message) })
  }
}