import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/service/order.service';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  public columns = ['fechaPedido','fechaEntrega','nombreCliente','nombreVendedor','totalPedido','Acciones'];

  public ProgresBar : any;
  Loading : boolean;
  Pedidos : Observable<any[]>;

  constructor(public miOrderService: OrderService) { }

  ngOnInit() {

    this.Pedidos = this.miOrderService.getInfoPrduct();

    this.Pedidos.subscribe(
      result =>{
        if(this.Pedidos)
       this.ProgresBar = document.getElementById('DivProgres').setAttribute('hidden','hidden');}
      )
  }

  //Metodo el cual nos borrara el pedido que hayamos seleccionado
  Borrar(id,fechaEntrega){


    var fecha = new Date();
    fecha = fechaEntrega
    let fechaNull = new Date(fecha);
    let year = fechaNull.getFullYear();
  
    if(year == 1){
      this.miOrderService.deleteOrder(id).subscribe(result=>{
        console.log(result)
        this.Pedidos = this.miOrderService.getInfoPrduct();
      })

      alert('Borrado correctamente')

    }else{
      
      alert('No puedes borrar pedidos entregados')
    }

   

   
  }
}
