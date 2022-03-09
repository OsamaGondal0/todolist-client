import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../models/User.model";
import { QueryMutationService } from "../QueryMutation.service";
import gql from "graphql-tag";
import { Task } from '../models/Task.model';
import { TokenPermission } from "../login/login.service";

@Injectable({
    providedIn: "root",
})
export class TaskService {
   
    byPassURL: boolean = true;

    constructor(
        private router: Router,
        private qmService: QueryMutationService,
    ) {}

    
    async createTask(task:string,description:string,deadline:Date):Promise<Task> {
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
    async updateCompletedForTask(id:number):Promise<Task> {
        let mutation = gql`
        mutation( $id: ID!){
            editCompleted(  id:$id){
                id
                task
                description
                deadline
                completed
                
            }
        }`;
        let variables= { id};
        let res= await this.qmService.Mutation( mutation, variables);
        return res
    }
    async sendToSalesForce(taskId:number,username:string,password:string,token:string):Promise<Task> {
        let mutation = gql`
        mutation( $taskId: ID!,$username:String!,$password:String!,$token:String!){
            sendToSaleForce(
                saleforceUsername: $username, 
                salesforcePassword: $password, 
                salesforceToken: $token, 
                id: $taskId)
              
        }`;
        let variables= { taskId,username,password,token};
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
    async getUsersWithoutAccess(): Promise<User[]>  {
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
    async getTasksforList(): Promise<Task[]> {
        let query = gql`
        query{
            getTasks    {
                id
                listId
                task
                description
                deadline
                completed
            }
        }
    `;
        return (await this.qmService.Query( query));
    }}