import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../models/User.model";
import { QueryMutationService } from "../QueryMutation.service";
import gql from "graphql-tag";
import { Subject } from "rxjs";

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
        let permission="DataEngineer"
        let mutation = gql `
        mutation( $email: String!,$password: String!){
            login(  email:$email,password:$password){
                user{
                    username 
                    email
                }
                token
                lists{
                    id
                }
            }
        }`;
        let variables= { email,password,permission};
        let res=await this.qmService.Mutation( mutation, variables);
        this.accountLoggedIn.next(res)
        return res 
    }

    async loginAccountWithPermission(listId:any):Promise<TokenPermission> {
        let mutation = gql `
        mutation( $accountId: ID!){
            loginListWithPermission(  listId:$listtId){
                token
                permission {
                    userId
                    listId
                }
            }
        }`;
        let variables= { listId};
        let res= await this.qmService.Mutation( mutation, variables);
        this.accountLoggedIn.next(res)
        return res
    
    }
    async updateUser(userId: number, name: string,image_url:string,password?: string)   {
        let mutation = gql`
            mutation($userId:ID!, $name:String,  $password:String,$image_url:String){
                editUser(userId:$userId, name:$name, password:$password,image_url:$image_url)    {
                    id
                    name
                    email
                    image_url
                }
            }
        `;
        let variables = { userId, name, password,image_url };
        return await this.qmService.Mutation( mutation, variables);
    }
    /**
     * Logout
     *
     */
    logout() {
        localStorage.removeItem("butterflyUserSession");
        localStorage.removeItem("userToken");
        window.location.replace("/login");
    }

    async getAccountsforUser(): Promise<any> {
        let query = gql`
            query{
                getAccountsforUser    {
                    organization
                    is_template
                }
            }
        `;
        return (await this.qmService.Query( query));
    }
    async getAccountById(id:any): Promise<any> {
        let query = gql`
            query($id:ID!){
                getAccountById(id:$id)    {
                    organization
                    id
                }
            }
        `;
        let variables= {id}
        return await this.qmService.Query( query,variables);
    }
    async getChildAccounts(): Promise<AccountRelationship[]> {
        let query = gql`
            query{
                getChildAccounts {
                    id
                    parent_id
                    parent{
                        id
                        organization
                    }
                    child_id
                    child{
                        id
                        organization
                    }
                }
            }
        `;
        return await this.qmService.Query( query);
    }

    async accountReload():Promise<UserToken>{
        let mutation = gql `
        mutation{
            resetToken{
                token
                permission {
                    user{
                        name
                        email
                        id
                        image_url
                    }
                    account{
                        organization
                        id
                        is_template
                    }
                    permission_type
                }
            }
        }`;
        return await this.qmService.Mutation( mutation).then((res)=>{
            this.byPassURL = false;
            localStorage.setItem("butterflyUserSession", JSON.stringify(res));
            if( res.permission)   {
                let resObj = {
                    user:  res.permission.user,
                    permission: res.permission,
                    token: res.token
                }
                this.accountLoggedIn.next(resObj)
            }
            return res;
        });
    }
}

export interface Permission {
    user: User,
    Account: {
        organization: string,
        is_template?: boolean,
    }
}
export interface TokenPermission{
    token:string
    permission: Permission
}
export interface UserToken{
    user:User,
    token:string,
    accounts:{
        id:number,
        organization:string,
        is_template: boolean
    }[]
}
enum Permission_Type    {
    Admin,
    Client,
    DataEngineer
}

export interface AccountRelationship {
    id: number,
    parent_id: number,
    child_id: number,
    parent: Account,
    child: Account
}
export interface Account {
    id: number,
    organization: string,
}