import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../models/User.model";
import { QueryMutationService } from "../QueryMutation.service";
import gql from "graphql-tag";
import { Subject } from "rxjs";
import { List } from "../models/List.model";

@Injectable({
    providedIn: "root",
})
export class LoginService {
    accountLoggedIn = new Subject();
    byPassURL: boolean = true;

    constructor(
        private router: Router,
        private qmService: QueryMutationService,
    ) {
        this.accountLoggedIn.subscribe((login: any) => {
            if( login.token)    {
                localStorage.setItem("userToken", login.token);
            }
        });
    }
    
   async login(email:string,password:string):Promise<UserToken>{
        let mutation = gql`
        mutation LoginUser($email: String!,$password: String!){
          login(email:$email,password:$password){
            token,
            user{
              id,
              username,
              email
            },
            lists{
              id,
              name,
              description
            }
          }
        }
        `;
        let variables= { email,password};
        let res=await this.qmService.Mutation( mutation, variables);
        this.accountLoggedIn.next(res)
        return res 
    }
    async createUser(email:string,username:string,password:string):Promise<String>{
        let mutation = gql`
        mutation addNewUser($email: String!,$username:String!,$password: String!){
            addNewUser(email:$email,username:$username,password:$password)
        }
        `;
        let variables= { email,password,username};
        let res=await this.qmService.Mutation( mutation, variables);
        this.accountLoggedIn.next(res)
        return res 
    }

    async loginListWithPermission(listId:any):Promise<TokenPermission> {
        let mutation = gql`
        mutation( $listId: ID!){
            loginListWithPermission(  listId:$listId){
                token
                    user{
                        username
                        email
                        id
                    }
                    list{
                        id  
                    }
                
            }
        }`;
        let variables= { listId};
        let res= await this.qmService.Mutation( mutation, variables);
        return res
    }
    async creatList(name:string,description:string):Promise<List> {
        let mutation = gql`
        mutation( $name: String!, $description: String!){
            addNewList(  name:$name , description:$description){
                id
                name
                description
                
            }
        }`;
        let variables= { name,description};
        let res= await this.qmService.Mutation( mutation, variables);
        return res
    }

    /**
     * Logout
     *
     */
    logout() {
        localStorage.removeItem("mainToken");
        localStorage.removeItem("userToken");
        window.location.replace("/login");
    }

    async getListsbyUser(): Promise<List[]> {
        let query = gql`
            query{
                getListsByUser{
                    id
                    name
                    description
                }
            }
        `;
        return (await this.qmService.Query( query));
    }
}

export interface UserToken{
    user:User,
    token:string,
    lists:List[]
}
export interface TokenPermission{
    user:User,
    token:string,
    list:List
}

