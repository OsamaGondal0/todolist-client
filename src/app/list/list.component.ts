import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';



const listQuerry = gql`
query getTasksByListId($listId:ID!){
  getTasksByListId(listId:$listId){
    tasks{
      task
    },token
  }
}
`;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  tasks: any[] | undefined;
  loading = true;
  error: any;
  id: number|any;
  private sub: any;

  constructor(private route: ActivatedRoute,private apollo: Apollo) {}

  ngOnInit() {
    this.onLoad();
    this.sub = this.route.params.subscribe(params => {
       this.id = +params['id']; // (+) converts string 'id' to a number

       // In a real app: dispatch action to load the details here.
    });}
    onLoad() {
      this.sub = this.route.params.subscribe(params => {
        this.id = +params['id'];})
      const observer = {
        next:(data:any) =>{ console.log(data);this.tasks=data.data.getTasksByListId.tasks; this.loading = false; },
        error:(error:any)=>{ this.error = error;this.loading = false; localStorage.removeItem("userToken"); },
        complete:()=>{console.log('complete')}
      }
     const subscription =this.apollo
        .query({
          query: listQuerry,
          variables:{
            listId: this.id
          }
        })
        .subscribe(
          observer
              ).unsubscribe;
        // .subscribe((result: any) => {
        //   console.log('aaaaaa',result);
        //   this.lists = result?.data?.getListsByUser;
        //   this.loading = result.loading;
        //   this.error = result.error;
        
        // });
      // console.log(this.loginForm.value.email, this.loginForm.value.password);
        
    }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}



