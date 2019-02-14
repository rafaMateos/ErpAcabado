import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }


  getProducts (): Observable<Product[]> {

    let headers = new HttpHeaders().set('Accept','application/json');
    
    return this.http.get<Product[]>("https://flamerpennyapi.azurewebsites.net/producto",{headers : headers})
  }
  
}


