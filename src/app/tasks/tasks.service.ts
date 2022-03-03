import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../models/User.model";
import { QueryMutationService } from "../QueryMutation.service";
import gql from "graphql-tag";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class TaskService {
   
    byPassURL: boolean = true;

    constructor(
        private router: Router,
        private qmService: QueryMutationService,
    ) {
    }
    
    async createTask(task:string,description:string,deadline:Date):Promise<TokenPermission> {
        let mutation = gql`
        mutation( $task: String!, $description: String!,$deadline:Date!){
            addNewTask(  task:$task , description:$description, deadline:$deadline){
                id
                task
                description
                deadline
                completed
                
            }
        }`;
        let variables= { task,description,deadline};
        let res= await this.qmService.Mutation( mutation, variables);
        return res
    }
    async addNewPermission(userId:number):Promise<TokenPermission> {
        let mutation = gql`
        mutation( $userId: ID!){
            addNewPermission(  userId:$userId ){
                id
                userId
                listId
                
            }
        }`;
        let variables= { userId};
        let res= await this.qmService.Mutation( mutation, variables);
        return res
    }
    async getUsersWithoutAccess()   {
        let query = gql`
            query{
                getUsersWithoutAccess{
                    id
                    username
                }
            }
        `;
        return await this.qmService.Query( query);
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

    async getListsbyUser(): Promise<any> {
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