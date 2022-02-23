import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';

const listsQuerry = gql`
query getListsByUser{
  getListsByUser{
    id
    heading
  }
}
`;
@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
 
  
  lists: any[] | undefined;
  loading = true;
  error: any;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.onLoad();
  }
  onLoad() {
    const observer = {
      next:(data:any) =>{ console.log(data);this.lists=data.data.getListsByUser; this.loading = false; },
      error:(error:any)=>{ this.error = error;this.loading = false; localStorage.removeItem("userToken"); },
      complete:()=>{console.log('complete')}
    }
   const subscription =this.apollo
      .query({
        query: listsQuerry,
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
}