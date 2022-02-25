import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import * as moment from 'moment';



const taskQuerry = gql`
query getTasksByListId($taskId:ID!){
  getTasksByListId(taskId:$taskId){
    id
    taskId
    task
    description
    deadline
    completed

  }
}
`;
@Component({
  selector: 'app-task',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: any[] | undefined;
  date : any | undefined;
  loading = true;
  error: any;
  id: number|any;
  private sub: any;

  constructor(private route: ActivatedRoute,private apollo: Apollo) {}

  ngOnInit() {
    this.date = moment('2022-02-16T19:00:00.000Z').fromNow();
    this.onLoad();
   }
    onLoad() {
      this.sub = this.route.params.subscribe(params => {
        this.id = +params['id'];})
      const observer = {
        next:(data:any) =>{ this.tasks=data.data.getTasksByListId; this.loading = false; },
        error:(error:any)=>{ this.error = error;this.loading = false; },
        complete:()=>{console.log('load complete')}
      }
     const subscription =this.apollo
        .query({
          query: taskQuerry,
          variables:{
            taskId: this.id
          }
        })
        .subscribe(
          observer
              ).unsubscribe;
        }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}



