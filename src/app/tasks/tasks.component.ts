import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import * as moment from 'moment';
import { Task } from '../models/Task.model';
import { TaskService } from './tasks.service';

const taskQuerry = gql`
query getTasks{
  getTasks{
    id
    listId
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

  newTask = new FormGroup({
    task: new FormControl(''),
    description: new FormControl(''),
    deadline: new FormControl('')
  });
  newUserWithPermission = new FormGroup({
    user: new FormControl(''),
  });
  tasks!: Task[];
  filteredTasks!: Task[]
  usersWithoutPermission!: any[];
  error: any;
  constructor(private route: ActivatedRoute, private apollo: Apollo, private taskService: TaskService) { }

  ngOnInit() {
    this.onLoad();
    this.taskService.getUsersWithoutAccess().then(
      async (data: any) => {
        this.usersWithoutPermission = data;
      }
    );
  }

  addUserToList() {
    console.log(this.newUserWithPermission.value.user.id);
    this.taskService.addNewPermission(this.newUserWithPermission.value.user.id).then(
      async (data: any) => {
        //console.log(data);
        //add code to remove added user from array
      })
      .catch(({ errors }) => { alert(errors[0].message) })
  }
  onNewTask() {
    console.log(this.newTask.value.task, this.newTask.value.description, this.newTask.value.deadline)
    this.taskService.createTask(this.newTask.value.task, this.newTask.value.description, this.newTask.value.deadline).then(
      async (data: any) => {
        console.log(data);
        this.tasks.push(data);
      })
      .catch(({ errors }) => { alert(errors[0].message) })
      ;
  }
  onLoad() {
    const observer = {
      next: ({ data }: any) => {
        let tempTask = JSON.stringify(data.getTasks);

        this.tasks = JSON.parse(tempTask);
        this.filteredTasks = [...this.tasks];
        this.setIntervalTimer();

      },
      error: ({ errors }: any) => { alert(errors[0].message) },
      complete: () => { console.log('load complete') }
    }
    const subscription = this.apollo
      .query({
        query: taskQuerry,
      })
      .subscribe(
        observer
      ).unsubscribe;

  }
  setIntervalTimer() {
    this.setTimer();
  }

  setTimer() {
    this.filteredTasks.map((element) => {
      let durationMilliSeconds = moment(element.deadline).diff(moment())
      let timeFromDeadline = durationMilliSeconds > 0 ? moment.duration(durationMilliSeconds, 'milliseconds') : moment.duration(-durationMilliSeconds, 'milliseconds');
      let days = moment.duration(timeFromDeadline).days(),
        hours = moment.duration(timeFromDeadline).hours(),
        minutes = moment.duration(timeFromDeadline).minutes(),
        seconds = moment.duration(timeFromDeadline).seconds();
      element.timer = `${durationMilliSeconds < 0 ? "Due By" : "Passed Due By"} ${days} days,${hours} hrs, ${minutes} m, ${seconds} s`
    })
  }
  applyFilter() {
    this.filteredTasks = this.tasks.filter((s) => { console.log(s); return s.timer?.includes('Due By'); })
    console.log('filtered data', this.filteredTasks);
  }


  ngOnDestroy() {
  }
}



