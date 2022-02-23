import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';

const loginMutation = gql`
mutation LoginUser($email: String!,$password: String!){
  login(email:$email,password:$password){
    token
  }
}
`;

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
  
  constructor(private apollo: Apollo) {}

  ngOnInit() {
  }
  onSubmit() {
    
    // console.log(this.loginForm.value.email, this.loginForm.value.password);
     this.apollo.mutate({
      mutation: loginMutation,
      variables: {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }
    })
      .subscribe({
        next({data}:any) { console.log( data.login.token); 
          localStorage.setItem('userToken', data.login.token);},
          
        error(error){
          alert(error);
        },
        complete(){alert('Login Succesful');}
      });
      
  }
}