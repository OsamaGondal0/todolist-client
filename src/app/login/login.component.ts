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
  subdomain: string;
  userToken: any;
  currentList: any;
  constructor(private apollo: Apollo, private router: Router, private loginService: LoginService) {
    this.subdomain = window.location.host.split('.')[0];
  }

  ngOnInit() { }
  async onSubmit() {
    await this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).then(
      async (data: any) => {
        this.userToken = data;
        this.userToken.lists.forEach((element: any) => {
          element.domainName = element.name.toLowerCase().replace(' ', '');
          element.url = `${environment.redirect_protocol}://${element.domainName}.${environment.redirect_domain}`
        });
        this.currentList = this.userToken.lists.find((element: any) => { return element.domainName == this.subdomain; });
        localStorage.setItem('userToken', data.token);
        if (this.currentList) { await this.loginWithListAccess(this.currentList.id); }
      }
    )
      .catch(err => { console.log('error', err) });

  }
  async loginWithListAccess(listId: any) {
    await this.loginService.loginListWithPermission(listId)
      .then(
        async (data: any) => {
          localStorage.setItem('mainToken', data.token);
          this.router.navigate(['list', listId]);
        })
      .catch(err => { console.log('list login ', err) })
  }
}