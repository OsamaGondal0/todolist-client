import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { environment } from 'src/environments/environment';
import { LoginService, UserToken, TokenPermission } from './login.service';
import { List } from '../models/List.model';
import { HomeComponent } from '../home/home.component'



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  subdomain: string;
  lists: List[] | undefined = [];
  currentList: any;
  constructor(private apollo: Apollo, private router: Router, private loginService: LoginService) {
    this.subdomain = window.location.host.split('.')[0];
  }

  ngOnInit() {
    this.checkLoggedIn();
  }




  async checkLoggedIn() {
    if (localStorage.getItem('userToken') != null) {
      await this.loginService.getListsbyUser().then(
        async (data: List[]) => {
          this.lists = data;
          this.lists.forEach((element: any) => {
            element.domainName = element.name.toLowerCase().replaceAll(' ', '');
            element.url = `${environment.redirect_protocol}://${element.domainName}.${environment.redirect_domain}`
          });
        }
      )
    }
  }
  async onLogin() {

    await this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).then(
      async (data: UserToken) => {
        this.lists = data.lists ? data.lists : [];
        this.lists.forEach((element: any) => {
          element.domainName = element.name.toLowerCase().replaceAll(' ', '');
          element.url = `${environment.redirect_protocol}://${element.domainName}.${environment.redirect_domain}`
        });
        if (this.subdomain != environment.redirect_domain) {
          this.currentList = this.lists.find((element: any) => { return element.domainName == this.subdomain; });
          if (this.currentList) { await this.loginWithListAccess(this.currentList.id); }
          else {
            throw new Error("User doesnt have access to this list");
          }
        }
        else {
          this.router.navigate(['home'])
        }
      }
    ).catch(({errors}) => {
      alert(errors[0]?.message);
    });

  }
  async loginWithListAccess(listId: number) {
    await this.loginService.loginListWithPermission(listId)
      .then(
        async (data: TokenPermission) => {
          localStorage.setItem('mainToken', data.token);
          this.router.navigate(['tasks'], { queryParams: { filter: 'all' } });
          window.location.reload;
        })
      .catch((errors) => {
        this.loginService.logout();
        alert(errors)
      })
  }
}