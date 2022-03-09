import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import * as moment from 'moment';
import { Task } from '../models/Task.model';
import { TaskService } from './tasks.service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-task',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  newTask = new FormGroup({
    task: new FormControl(''),
    description: new FormControl(''),
    deadline: new FormControl('')
  });
  newUserWithPermission = new FormGroup({
    user: new FormControl(''),
  });
  sendToSalesforce = new FormGroup({
    username:  new FormControl(''),
    password:  new FormControl(''),
    token:  new FormControl(''),
  })
  filter!: string;
  tasks!: Task[];
  filteredTasks!: Task[]
  usersWithoutPermission!: any[];
  error: any;
  constructor(private route: ActivatedRoute, private apollo: Apollo, private taskService: TaskService) { }

  ngOnInit() {
    this.onLoad();
    // this.filter = this.route.snapshot.queryParams['filter'] ? this.route.snapshot.queryParams['filter'] : 'any'
    // this.filterTask(this.filter);
    this.route.queryParams.subscribe(
      (queryParams: Params) => { this.filter = queryParams['filter'] ? queryParams['filter'] : 'all';
      if(this.tasks!=null) this.filterTask(this.filter); }
    )
    

  }
  async onSendToSalesForce(taskId:number){
    await this.taskService.sendToSalesForce(taskId,this.sendToSalesforce.value.username,this.sendToSalesforce.value.password,this.sendToSalesforce.value.token);

  }
  async onClick(task:Task)
  {
      await this.taskService.updateCompletedForTask(task.id);
  }

  addUserToList() {
    let userId =this.newUserWithPermission.value.user.id;
    this.taskService.addNewPermission(userId).then(
      async (data: any) => {
        this.usersWithoutPermission = this.usersWithoutPermission.filter((element)=>element.id!=userId)
      })
      .catch(({ errors }) => { alert(errors[0].message) })
  }
  onNewTask() {
    console.log(this.newTask.value.task, this.newTask.value.description, this.newTask.value.deadline)
    this.taskService.createTask(this.newTask.value.task, this.newTask.value.description, this.newTask.value.deadline).then(
      async (data: Task) => {
        console.log(data);
        this.tasks.push(data);
      })
      .catch(({ errors }) => { alert(errors[0].message) })
      ;
  }
  async onLoad() {
   await  this.taskService.getTasksforList().then(
      async (data: any) => {
        console.log(data);
        this.tasks = JSON.parse(JSON.stringify(data));
      })
      .catch(({ errors }) => { alert(errors[0].message) });
    await this.taskService.getUsersWithoutAccess().then(
      async (data: any) => {
        this.usersWithoutPermission = data;
      }
    );
    this.filter = this.route.snapshot.queryParams['filter'] ? this.route.snapshot.queryParams['filter'] : 'any'
    this.filterTask(this.filter);
    this.setIntervalTimer()
  }
  setIntervalTimer() {
    this.setTimer();
    setInterval(
      () => this.setTimer()
      , 1000);
  }

  setTimer() {
    this.filteredTasks.map((element) => {
      let durationMilliSeconds = moment(element.deadline).diff(moment())
      let timeFromDeadline = durationMilliSeconds > 0 ? moment.duration(durationMilliSeconds, 'milliseconds') : moment.duration(-durationMilliSeconds, 'milliseconds');
      let days = moment.duration(timeFromDeadline).days(),
        hours = moment.duration(timeFromDeadline).hours(),
        minutes = moment.duration(timeFromDeadline).minutes(),
        seconds = moment.duration(timeFromDeadline).seconds();
      element.timer = ` ${days} days,${hours} hrs, ${minutes} m, ${seconds} s ${durationMilliSeconds > 0 ? "until due" : "past due"} `
    })
  }
  filterTask(filter: string) {
    if (filter == 'completed') {
      this.filteredTasks = this.tasks.filter((s) => s.completed == true)
    }
    else if (filter == 'incomplete') {
      this.filteredTasks = this.tasks.filter((s) => s.completed == false)
    }
    else if (filter == 'late') {
      this.filteredTasks = this.tasks.filter((s) => moment(s.deadline).diff(moment()) < 0)
    } else 
    { this.filteredTasks = this.tasks }

  }

  ngOnDestroy() {
  }
}



