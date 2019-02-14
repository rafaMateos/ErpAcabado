import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrder } from '../IOrder';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  apiURL: string = 'https://flamerpennyapi.azurewebsites.net/cliente';

  constructor(private http: HttpClient) { }

  public getCustomers(): Observable<any> {
    let headers = new HttpHeaders().set('Accept', 'application/json');
    return this.http.get<any>(this.apiURL,{headers : headers});
  }

}
