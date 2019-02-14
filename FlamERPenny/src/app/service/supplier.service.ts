import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrder } from '../IOrder';
import { Supplier } from '../models/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  apiURL: string = 'https://flamerpennyapi.azurewebsites.net/vendedor';

  constructor(private http: HttpClient) { }

  public getSuppliers(): Observable<any> {
    let headers = new HttpHeaders().set('Accept', 'application/json');
    return this.http.get<any>(this.apiURL,{headers : headers});
  }

  public newSupplier(newSupplier : Supplier) {

    var apiUrlLinea : string = this.apiURL;
    let headers = new HttpHeaders().set('Content-Type','application/json');
    var supplierToAdd = JSON.stringify(newSupplier);
    this.http.post(apiUrlLinea, supplierToAdd , {headers : headers} ).subscribe(result =>{

      console.log(result);

  
    }, error =>{ console.log(error)}
    
    
    ); 



  }

}
