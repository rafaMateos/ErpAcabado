import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrder } from '../IOrder';
import { Order } from '../models/order';
import { pedidoPost } from '../models/pedidoPost';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class OrderService {

 apiURLv: string = 'https://flamerpennyapi.azurewebsites.net/pedido/';
 apiURLv2: string = 'https://flamerpennyapi.azurewebsites.net/producto/';


  constructor(private http: HttpClient) { }

  public getInfoClient(id) : Observable<any>{
    let headers = new HttpHeaders().set('Accept','application/json');
    return this.http.get<any>(this.apiURLv+ id,{headers : headers});
  }

  public getInfoPrduct() : Observable<any[]>{
    let headers = new HttpHeaders().set('Accept','application/json');
    return this.http.get<any>(this.apiURLv,{headers : headers});
  }


  public getInfoLineas(id) : Observable<any[]>{
    let headers = new HttpHeaders().set('Accept','application/json');
    return this.http.get<any[]>(this.apiURLv+ id + '/lineaPedido',{headers : headers});
  }

  public getInfoPrductGeneral() : Observable<any[]>{
    let headers = new HttpHeaders().set('Accept','application/json');
    return this.http.get<any>(this.apiURLv2,{headers : headers});
  }

  public getInfoPrductID(id) : Observable<any[]>{
    let headers = new HttpHeaders().set('Accept','application/json');
    return this.http.get<any[]>(this.apiURLv2 + id,{headers : headers});
  }

  public deleteOrder(id) : Observable<any>{
    
    return this.http.delete(this.apiURLv + id);
 }



public getLinea(idLinea,idPedido) : Observable<any[]>{
  let headers = new HttpHeaders().set('Accept','application/json');
  return this.http.get<any[]>(this.apiURLv + idLinea + '/lineaPedido/' + idPedido,{headers : headers});
}

public guardarPedido(pedido: Order): Observable <any>{

  let headers = new HttpHeaders().set('Content-Type','application/json');
  var idPedido: number = 0;
  
  //post de pedido { idPedido, idCliente , nombreVendedor, fechaPedido, fechaEntrega , totalPedido }
  var pedidoParaPOST_: pedidoPost = new pedidoPost();

  pedidoParaPOST_.idPedido = 0;
  pedidoParaPOST_.idCliente = pedido.idCliente;
  pedidoParaPOST_.nombreVendedor = pedido.nombreVendedor;
  pedidoParaPOST_.fechaPedido = pedido.fechaEntrega;
  pedidoParaPOST_.totalPedido = pedido.totalPedido;

  var pedidoPreparado = JSON.stringify(pedidoParaPOST_);
  return this.http.post(this.apiURLv, pedidoPreparado , {headers : headers} ).pipe(map((response: Response) => response)); //recoger el id del pedido devuelto
}

public guardarLineasPedido(lineaPedidoParaPOST_: any): Observable<any>{  
  //postLineas de pedido ( idPedido, idProducto , precioUnitario , cantidad , impuestos , subtotal )
  //foreach en lineas de pedido crear un objeto con los atributos deseados para el post
  var apiUrlLinea : string = this.apiURLv + lineaPedidoParaPOST_.idPedido + "/lineaPedido";
  let headers = new HttpHeaders().set('Content-Type','application/json');
  var lineaPedidoPreparada = JSON.stringify(lineaPedidoParaPOST_);
  return this.http.post(apiUrlLinea, lineaPedidoPreparada , {headers : headers} ); 
}


  
  
}
