import { Injectable } from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { resolve } from 'q';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  vendor : String;

  constructor(public afAuth: AngularFireAuth, private http: HttpClient, public router : Router) {

   }

   logout(){

    return this.afAuth.auth.signOut();
   }


   LoginUser(email: string, pass: string){
  
    return new Promise((resolve , reject)=>{

      this.afAuth
        .auth
        .signInWithEmailAndPassword(email , pass)
        .then(value => {

          var send = "{\"username\":\"" + email + "\"}"
          let headers = new HttpHeaders().set('Content-Type','application/json');
          this.http
            .post('https://flamerpennyapi.azurewebsites.net/vendedor/',send,{headers : headers})
            this.router.navigateByUrl("/home")
            this.vendor = email;

        })
        .catch(err => {
          alert("Login failed, incorrect email or password")
        });

    } );

   }

   Create(email: string, pass: string){

    return new Promise((resolve , reject)=>{

      this.afAuth.auth.createUserWithEmailAndPassword(email , pass)
      .then(userData => resolve(userData),
      err => reject(err))

    });
   
   
}



}
