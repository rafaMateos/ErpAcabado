import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private http: HttpClient) { }

  getClients (): Observable<Client[]> {
    let headers = new HttpHeaders().set('Accept','application/json');
    return this.http.get<Client[]>("https://flamerpennyapi.azurewebsites.net/cliente",{headers : headers})
  }

}
