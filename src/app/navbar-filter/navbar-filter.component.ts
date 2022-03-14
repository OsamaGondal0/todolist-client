import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService,UserToken,TokenPermission } from '../login/login.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'task-navbar-filter',
  templateUrl: './navbar-filter.component.html',
  styleUrls: ['./navbar-filter.component.css']
})
export class NavbarFilterComponent implements OnInit {  
  domain!: string;
  constructor( private route:ActivatedRoute,private loginService:LoginService) {}

  ngOnInit(): void {
    this.domain = environment.frontend_url;

  }

  onLogout(){
    this.loginService.logout();
  }
  
}
