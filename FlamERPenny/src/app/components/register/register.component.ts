import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { SupplierService } from 'src/app/service/supplier.service';
import { Supplier } from 'src/app/models/supplier';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  newSup : Supplier = new Supplier();
  public email : string;
  public email2 : string;
  public pass : string;
  
  
  constructor(public firebase:AuthService, public supplier: SupplierService, public router : Router) { }

  ngOnInit() {}


    onSubmit(formData) {
  

     this.email = formData.value.email
     this.email2 = formData.value.email2
     this.pass = formData.value.pass


    if(this.email.toString() != this.email2.toString() || this.pass.toString() == ""){

      alert("Please try again");

    }else{

    this.newSup.username = this.email.toString();
    
    console.log(JSON.stringify(this.newSup));

  

    this.supplier.newSupplier(this.newSup)

    this.firebase.Create(this.email.toString(), this.pass.toString());

      alert("Account created :)");
      this.router.navigateByUrl("/login");
    }
  
        
    }

}
