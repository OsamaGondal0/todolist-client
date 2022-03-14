import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { environment } from 'src/environments/environment';
import { LoginService, UserToken, TokenPermission } from '../login/login.service';
import { List } from '../models/List.model';
import { MatDialog } from '@angular/material/dialog'
import { NotificationComponent } from './notification/notification.component';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  newList = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });
  newUser = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}') 
    ]),
  });
  panelOpenState = false;
  subdomain: string;
  lists: List[] = [];
  currentList: any;
  constructor(private apollo: Apollo, private router: Router, private loginService: LoginService, public dialog: MatDialog) {
    this.subdomain = window.location.host.split('.')[0];
    apollo.subscribe({
      query: gql`
      subscription permissionToNewList{
        permissionToNewList{
          message
          list{
            id
            name
            description
          }
        }
      }
      `,

      /*
        accepts options like `errorPolicy` and `fetchPolicy`
      */
    }).subscribe(({ data }: any) => {
      if (data?.permissionToNewList) {
        this.openDialog(  data.permissionToNewList.message );
        data.permissionToNewList.list.domainName = data.permissionToNewList.list.name.toLowerCase().replaceAll(' ', '');
        data.permissionToNewList.list.url = `${environment.redirect_protocol}://${data.permissionToNewList.list.domainName}.${environment.redirect_domain}`
        this.lists?.push(data?.permissionToNewList.list)
        //, data.permissionToNewList);
      }
    });
  }
  onLogout() {
    this.loginService.logout();
    // this.openDialog({message:'hello'})
  }
  onHome() {
    this.router.navigate(['/home']);
  }


  openDialog(message: any) {

    const dialogRef = this.dialog.open(NotificationComponent, {
      data:{message}
    });

    dialogRef.afterOpened().subscribe(_ => {
      setTimeout(() => {
        dialogRef.close();
      }, 5000)
    })
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


  async onCreateList() {
    await this.loginService.creatList(this.newList.value.name, this.newList.value.description).then(
      async (data: List) => {
        data.url = `${environment.redirect_protocol}://${data.name.toLowerCase().replaceAll(' ', '')}.${environment.redirect_domain}`
        if (this.lists) { this.lists.push(data); }
        this.newList.reset();
      }
    ).catch(({ errors }) => { alert(errors[0].message) });

  }
  async onCreateUser() {
    await this.loginService.createUser(this.newUser.value.email, this.newUser.value.username, this.newUser.value.password).then(
      async (data: String) => {
        alert(data)
      }
    ).catch(({ errors }) => { alert(errors[0].message) });
  }
  async loginWithListAccess(listId: number) {
    await this.loginService.loginListWithPermission(listId)
      .then(
        async (data: TokenPermission) => {
          localStorage.setItem('mainToken', data.token);
          this.router.navigate(['tasks']);
        })
      .catch(({ errors }) => { alert(errors[0].message) })
  }
}