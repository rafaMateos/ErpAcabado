import { Component, OnInit, inject } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import { getPreviousOrParentTNode } from '@angular/core/src/render3/state';
import { getRootComponents } from '@angular/core/src/render3/discovery_utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  /*Prueba*/
})
export class LoginComponent implements OnInit {

  public user_name:any;
  public user_password:any;


  constructor(public firebase:AuthService, public router : Router) { }

  onSubmit(formData){

    var user = formData.value.email
    var pass = formData.value.pass

    this.firebase.logout();

    this.firebase.LoginUser(user, pass).then((success) =>{
      this.router.navigateByUrl("/home")
    });
   
  }

  ngOnInit() {
  }

}
