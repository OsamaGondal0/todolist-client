import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService,UserToken,TokenPermission } from '../login/login.service';


@Component({
  selector: 'task-navbar-filter',
  templateUrl: './navbar-filter.component.html',
  styleUrls: ['./navbar-filter.component.css']
})
export class NavbarFilterComponent implements OnInit {

  constructor( private route:ActivatedRoute,private loginService:LoginService) {}

  ngOnInit(): void {
  }

  onLogout(){
    this.loginService.logout();
  }
  
}
