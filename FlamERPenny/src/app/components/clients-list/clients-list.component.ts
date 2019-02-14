import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap  } from 'rxjs/operators';
import { Client } from 'src/app/models/Client';
import { ClientsService } from 'src/app/service/clients.service';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit {

  public dataSource$ : Observable<Client[]>;
  public columns = ['id', 'nombre'];
  public ProgresBar : any;

  public currentPage$ = new BehaviorSubject<number>(1);
  public dataOnPage$ = new Observable<Client[]>();

  public pageSize = 12;

  constructor(private clientsService : ClientsService) { }

  ngOnInit() {
    this.getClients();

    
    this.dataOnPage$ = this.currentPage$.pipe(
      switchMap(() => this.dataSource$),
      map(v => {
        const jdx = (this.currentPage$.value - 1) * this.pageSize;
        return Object.values(v).slice(jdx, jdx + this.pageSize)
      })
    )

    this.currentPage$.subscribe(
      result =>{
        
       this.ProgresBar = document.getElementById('DivProgres').setAttribute('hidden','hidden');}
      )
  }

  getClients() : void {
    this.dataSource$ = this.clientsService.getClients()
  }

}
