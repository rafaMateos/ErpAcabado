import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { FormControl } from '@angular/forms';
import { map, switchMap  } from 'rxjs/operators';
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  public ProgresBar : any;

  public dataSource$ : Observable<Product[]>;
  public columns = ['nombre', 'precioVenta', 'descripcion', 'stock', 'listaCategorias'];

  constructor(private productsService : ProductService) { }

  ngOnInit() {
    this.getProducts();

    this.dataSource$.subscribe(
      result =>{
        
       this.ProgresBar = document.getElementById('DivProgres').setAttribute('hidden','hidden');}
      )

  }

  getProducts() : void {
    this.dataSource$ = this.productsService.getProducts();
  }

}
