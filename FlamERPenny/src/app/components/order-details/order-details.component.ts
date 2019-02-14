import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { MatTableModule } from '@angular/material/table';
import { observable, Observable, empty } from 'rxjs';
import { IOrder } from 'src/app/IOrder';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { LineaPedido } from 'src/app/models/LineaPedido';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';
import { PedidoGlobal } from 'src/app/models/PedidoGlobal';
import { Alert } from 'selenium-webdriver';
import { OrderService } from 'src/app/service/order.service';




@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  ultimo:boolean = false;
  json : string;
  LineaPedido: LineaPedido = new LineaPedido();
  LineaPedidoActu: LineaPedido = new LineaPedido();
  miOrder : any[];
  actuFecha :PedidoGlobal = new PedidoGlobal();
  ProductToSelect : string;
  ArrayDeProductos : Product[] = [];
  Temporal : Product[] = []
  Stock:string
  SubTotal: any = 0.0;
  SubTotalEdit : any = 0.0;
  id : string
  max:string;
  select : any;
  Data : any;
  p : Product;
  miLineasDePedido : Observable<any[]> = new Observable;
  miLineasDePedido2 :string
  miLineasDePedido4 :string
  miLineasDePedido3 : any[] = [];
  miLineasDePedido5 : any[] = [];
  ProductsToFilter : string[] = [];
  StockTotal : any = 0;
  cantidadReservada : any = 0;
  CantidadCompare : any;
  totalprice : any = 0;
  apiURLv: string = 'https://flamerpennyapi.azurewebsites.net/pedido/';

  public ProgresBar : any;

  private fechaSelecionada: Date = new Date();

  flecha: any;
  productid: number
  //public columns = ['name', 'description', 'category', 'units', 'unitPrice', 'taxes','subTotal']
  public columns = ['nombre', 'descripcion', 'listaCategorias', 'cantidad','precioUnitario','impuestos','subtotal','Acciones']



  constructor(public miOrderService: OrderService,private httpClient:HttpClient,private route: ActivatedRoute) { }

  public ngOnInit() {
    
    this.id = this.route.snapshot.paramMap.get('id');
    this.miLineasDePedido = this.miOrderService.getInfoLineas(this.id);
    

    this.miOrderService.getInfoLineas(this.id).subscribe(result =>{
        this.miLineasDePedido2 = JSON.stringify(result)
        this.miLineasDePedido3 = JSON.parse(this.miLineasDePedido2);

        for(var i = 0; i < this.miLineasDePedido3.length; i++){

          this.totalprice += this.miLineasDePedido3[i].subtotal;
        }

    })

   

    this.miOrderService.getInfoPrductGeneral().subscribe(result =>{
      this.miOrder = result;
      this.ProductToSelect = JSON.stringify(result)
      this.Temporal = JSON.parse(this.ProductToSelect)

     })

   
      this.miOrderService.getInfoClient(this.id).subscribe(result => {
        this.Data = result;
      });


   


  }

  public Open(){

    this.miOrderService.getInfoLineas(this.id).subscribe(result =>{
      this.miLineasDePedido2 = JSON.stringify(result)
      this.miLineasDePedido3 = JSON.parse(this.miLineasDePedido2);

      this.ArrayDeProductos = [];
      this.ProductsToFilter = [];

      for(var i = 0; i< this.miLineasDePedido3.length; i++){
       
        this.ProductsToFilter.push(this.miLineasDePedido3[i].producto.nombre)
  
      }
  
      for(var i = 0; i< this.Temporal.length; i++){
  
        if(!this.ProductsToFilter.includes(this.Temporal[i].nombre)){
  
          this.ArrayDeProductos.push(this.Temporal[i]);
  
        }
       }

  })

  if(this.miLineasDePedido3.length == 0){

    for(var i = 0; i< this.Temporal.length; i++){
      this.ArrayDeProductos.push(this.Temporal[i]);
    }

  }



     var fecha = new Date();
     fecha = this.Data.fechaEntrega
 
     let fechaNull = new Date(fecha);
     let year = fechaNull.getFullYear();
   
     if(year != 1){
 
       alert('No puedes crear pedidos si ya esta entregado')
     }else{


      document.getElementById('NewProduct').removeAttribute('hidden');

     }


  }

  public ProductoSeleccionado(id){

     this.miOrderService.getInfoPrductID(id).subscribe(r =>{

      this.json =JSON.stringify(r);

      this.p = JSON.parse(this.json);
  
      this.max = this.p.stock.toString();

      document.getElementById('cantidad').setAttribute('max',this.max);

      document.getElementById('precio').setAttribute('value',this.p.precioVenta);
      
      document.getElementById('stockdispo').innerText = this.p.stock.toString();

     })

  
  }


  public Borrar(id){

 
    var fecha = new Date();
    fecha = this.Data.fechaEntrega

    let fechaNull = new Date(fecha);
    let year = fechaNull.getFullYear();
  
    if(year == 1){
     this.deleteLine(id,this.id);
     
      //this.reloadPage();
    }else{
      alert('No puedes borrar un pedido ya entregado')
    }
  }

  public deleteLine(idLinea,idPedido):void{

    this.ultimo = true;
     this.httpClient.delete(this.apiURLv + idPedido + '/lineaPedido/' + idLinea).subscribe(result =>{

        this.ultimo = false;

        this.miLineasDePedido = this.miOrderService.getInfoLineas(this.id);
        alert('Borrado')
        
    });

    if(this.ultimo){
   
    }

 }


  public save(){

    var preciounit : number = parseFloat((<HTMLInputElement>document.getElementById("precio")).value);
    let cantidad : number = parseInt((<HTMLInputElement>document.getElementById("cantidad")).value);
   
    this.LineaPedido.idPedido = parseInt(this.id)
    this.LineaPedido.idProducto = parseInt(this.p.id);  
    this.LineaPedido.precioUnitario = preciounit;

    this.LineaPedido.cantidad = cantidad;
    this.LineaPedido.impuestos = 1.21;
    this.LineaPedido.subtotal =  this.SubTotal;


    console.log(this.LineaPedido)

    if(this.LineaPedido.cantidad > this.p.stock){

      alert('No stock suficiente')

    }if(this.LineaPedido.precioUnitario < 0){

      alert('Precio menor que 0 es de tontos vamos')
  
      }

    else{

      (<HTMLSelectElement>document.getElementById("select")).selectedIndex = 0;

      document.getElementById('NewProduct').setAttribute('hidden','hidden');

      console.log(JSON.stringify(this.LineaPedido))
  
      this.addProducto(this.LineaPedido);

      this.limpiar();
  
    }

  }

  limpiar(){

    (<HTMLSelectElement>document.getElementById("select")).selectedIndex = 0;

    (<HTMLInputElement>document.getElementById("cantidad")).value = "";

    (<HTMLInputElement>document.getElementById("precio")).value = "";
    

    document.getElementById('stockdispo').innerText = "";

    this.SubTotal = 0;


  }

  limpiarE(){



    (<HTMLInputElement>document.getElementById("cantidadE")).value = "";

    (<HTMLInputElement>document.getElementById("precioE")).value = "";
    

    document.getElementById('stockdispoE').innerText = "";

    this.SubTotalEdit = 0;


  }
  
  public addProducto(LineaPedido): void{
  
    var send = JSON.stringify(LineaPedido);
    let headers = new HttpHeaders().set('Content-Type','application/json');
     
     this.httpClient.post('https://flamerpennyapi.azurewebsites.net/pedido/'+this.LineaPedido.idPedido +'/lineapedido',send,{headers : headers})
     .subscribe(
       result => 
       {console.log('Todo flama'),
       this.miLineasDePedido = this.miOrderService.getInfoLineas(this.id)

       this.totalprice = 0;
       this.miOrderService.getInfoLineas(this.id).subscribe(result =>{
        this.miLineasDePedido2 = JSON.stringify(result)
        this.miLineasDePedido3 = JSON.parse(this.miLineasDePedido2);

        for(var i = 0; i < this.miLineasDePedido3.length; i++){

          this.totalprice += this.miLineasDePedido3[i].subtotal;
        }

    })


       },
       error =>{console.log(error)})

  }

  public Editar(id){
 

  document.getElementById('EditarPro').removeAttribute('hidden');

  this.miOrderService.getLinea(this.id,id).subscribe(result =>{

    this.json =JSON.stringify(result);

    this.LineaPedidoActu = JSON.parse(this.json);

    this.CantidadCompare = this.LineaPedidoActu.cantidad;
    
    document.getElementById('cantidadE').setAttribute('value',this.LineaPedidoActu.cantidad.toString());

    document.getElementById('precioE').setAttribute('value',this.LineaPedidoActu.precioUnitario.toString());

    document.getElementById('totalE').setAttribute('value',this.LineaPedidoActu.subtotal.toString());
    
    

  })

  this.miOrderService.getInfoPrductID(id).subscribe(r =>{

    this.productid = id;

    this.json =JSON.stringify(r);

    this.p = JSON.parse(this.json);

 
    document.getElementById('stockdispoE').innerText = this.p.stock.toString();
  

  })

  }

  public Actualizar(){

    

  document.getElementById('EditarPro').setAttribute('hidden','hidden');
  

  var preciounit : number = parseFloat((<HTMLInputElement>document.getElementById("precioE")).value);
  let cantidad : number = parseInt((<HTMLInputElement>document.getElementById("cantidadE")).value);
  

    this.LineaPedido.idPedido = parseInt(this.id)
    this.LineaPedido.idProducto = this.productid;
    this.LineaPedido.precioUnitario = preciounit;

    this.LineaPedido.cantidad = cantidad;
    this.LineaPedido.impuestos = 1.21;
    this.LineaPedido.subtotal =  this.SubTotalEdit;

    if((this.p.stock + this.CantidadCompare) - (this.LineaPedido.cantidad)  < 0 || this.LineaPedido.cantidad >(this.p.stock + this.CantidadCompare)){

      alert('Stock insuficiente');

    }if(this.LineaPedido.precioUnitario < 0){

      alert('Precio menor que 0 es de tontos vamos')

    }
     else{

    var fecha = new Date();
    fecha = this.Data.fechaEntrega

    let fechaNull = new Date(fecha);
    let year = fechaNull.getFullYear();
  
    if(year != 1){

      alert('No puedes editar una linea de un pedido ya enviado')

    }else{

      this.ActualizarLinea(this.LineaPedido);

    

     
 
     

    }
    
}

  }
 
  public ActualizarLinea(LineaPedido): void{
  
  var send = JSON.stringify(LineaPedido);
  let headers = new HttpHeaders().set('Content-Type','application/json');
   
   this.httpClient.put('https://flamerpennyapi.azurewebsites.net/pedido/'+this.LineaPedido.idPedido +'/lineapedido',send,{headers : headers})
   .subscribe(
     result => 
     {console.log('Todo flama')
     this.miLineasDePedido = this.miOrderService.getInfoLineas(this.id) 
      
      this.totalprice = 0;
      this.miOrderService.getInfoLineas(this.id).subscribe(result =>{
       this.miLineasDePedido2 = JSON.stringify(result)
       this.miLineasDePedido3 = JSON.parse(this.miLineasDePedido2);

       for(var i = 0; i < this.miLineasDePedido3.length; i++){

         this.totalprice += this.miLineasDePedido3[i].subtotal;
       }

   })


    },
     error =>{console.log(error)})

    
  }

  public CalcularCantidad(){

  var preciounit : number = parseFloat((<HTMLInputElement>document.getElementById("precio")).value);
  var cantidad : number = parseInt((<HTMLInputElement>document.getElementById("cantidad")).value);
  var impuesto = 1.21

   this.SubTotal = preciounit * cantidad * impuesto;

  }

  public CalcularCantidadEditar(){

  var preciounit : number = parseFloat((<HTMLInputElement>document.getElementById("precioE")).value);
  let cantidad : number = parseInt((<HTMLInputElement>document.getElementById("cantidadE")).value);
  var impuesto = 0.21

  this.SubTotalEdit = (preciounit * cantidad) + (preciounit * cantidad * impuesto);


  }

  CambiarFecha(fechaEntrega){

    var fecha = new Date();
    fecha = fechaEntrega
    let fechaNull = new Date(fecha);
    let year = fechaNull.getFullYear();
  
    if(year != 1){
      alert('No puedes cambiar la fecha de un pedido ya entregado')
    }else{

      document.getElementById('fecha').removeAttribute('hidden');

    }
  }

  helow(){

    var fecha = new Date();
 
    var hora = fecha.getHours().toString();

    var horaCompare = parseInt(hora);

    if(horaCompare < 10){

     hora = "0"+ hora;

    }

    var result: string =  fecha.getUTCFullYear() + "-" + "02" + "-" +fecha.getUTCDate() + "T" + hora + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();

    
    var Fecha = new Date();
    Fecha = this.Data.fechaEntrega

    let fechaNull = new Date(Fecha);
    let year = fechaNull.getFullYear();

    if(year == 1){

      this.actuFecha.fechaEntrega = result;
      this.actuFecha.fechaPedido = this.Data.fechaPedido;
      this.actuFecha.id = this.Data.id;
      this.actuFecha.idCliente = this.Data.idCliente;
      this.actuFecha.nombreVendedor = this.Data.nombreVendedor;
      this.actuFecha.totalPedido = this.Data.totalPedido;
  
    
        this.ActuFecha(this.actuFecha)
        
    }else{

      alert('El pedido ya fue entregado');
    }
   

    //var json = JSON.stringify(this.actuFecha);
  


  }

  
  public ActuFecha(fechaNueva): void{
  
    var send = JSON.stringify(fechaNueva);
    let headers = new HttpHeaders().set('Content-Type','application/json');
     
     this.httpClient.put('https://flamerpennyapi.azurewebsites.net/pedido',send,{headers : headers})
     .subscribe(
       result => 
       {
         console.log(result)
         
      this.miOrderService.getInfoClient(this.id).subscribe(result => {
        this.Data = result;
      });
      alert('Actualizada correctamente')
      });

  }

  public hide(){

    this.limpiar();
    document.getElementById('NewProduct').setAttribute('hidden','hidden');

  }

  public hideE(){

    document.getElementById('EditarPro').setAttribute('hidden','hidden');

  }


}
