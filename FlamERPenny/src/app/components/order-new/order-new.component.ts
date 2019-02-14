import { Component, OnInit, IterableDiffers } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule, MAT_DATE_FORMATS } from '@angular/material';
import { Observable, BehaviorSubject, forkJoin} from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';



//import { IOrder, IProduct, ILineaPedido } from '../../IOrder';
import { isProceduralRenderer } from '@angular/core/src/render3/interfaces/renderer';
import { Order } from '../../models/order';
import { Product } from '../../models/product';
import { ProductService } from 'src/app/service/product.service';
import { CustomerService } from 'src/app/service/customer.service';
import { SupplierService } from 'src/app/service/supplier.service';
import { OrderService } from 'src/app/service/order.service';
import { lineaPedidos } from 'src/app/models/lineaPedidos';
import { lineaPedidoPost } from 'src/app/service/lineaPedidoPost';
import { AuthService } from 'src/app/service/auth.service';
import { auth } from 'firebase';

export interface Customer {
  name: string;
  id: number;
}

export interface Supplier {
  name: string;
  id: number;
}

@Component({
  selector: 'app-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.css']
})


export class OrderNewComponent implements OnInit {

  misCustomers: Observable<Customer[]>;
  misSuppliers: Observable<Supplier[]>;
  misProducts: Observable<any[]>;
  tempLineaPedido: lineaPedidos;

  precioTotalPedido : number = 0;
  idPedido: number = 0;
  vendorName = this.auth.vendor.toString();

  minDate = new Date();
  public dispatchDateDisabled = true;
  
  misLineasDePedido: any[] = [];
  private observableLineasPedido$ = new BehaviorSubject (this.misLineasDePedido); 

  dataSource$: Observable<any[]>;

  //pedido: IOrder;
  iterableDiffer;

  public columns = ['nombre', 'descripcion', 'listaCategorias', 'stock', 'unidades', 'precioUnitario', 'impuestos', 'subtotal', 'Acciones'];

  customers: Customer[];
  customerSeleccionado : any;
  suppliers: Supplier[];
  products: any[];

  constructor(public miCustomerService: CustomerService, public miSupplierService: SupplierService, public miProducService: ProductService, public miOrderService:OrderService, 
    private httpClient: HttpClient, private route: ActivatedRoute, private _iterableDiffers: IterableDiffers, public router: Router, public auth: AuthService) {
      this.iterableDiffer = this._iterableDiffers.find([]).create(null);
      this.dataSource$ = this.observableLineasPedido$.pipe(map(v=>Object.values(v)));
  }

  ngOnInit() {
    this.miCustomerService.getCustomers().subscribe(result =>{
      this.customers = result;
    });

    /*
    this.miSupplierService.getSuppliers().subscribe(result =>{
      this.suppliers = result;
    });*/

    this.miProducService.getProducts().subscribe(result =>{
      this.products = result;
    });
  }

  ngDoCheck() {
    let changes = this.iterableDiffer.diff(this.misLineasDePedido);
    if (changes) {
      console.log('Changes detected!');
    }
  }

  public addProducto(value: any){

    var canInsertar: boolean = true;

    this.misLineasDePedido.forEach(lineas => {
      if(lineas.idProducto == value.id){
        canInsertar = false;
      }
    });
    
    if(canInsertar){
    this.tempLineaPedido = new lineaPedidos();
    this.tempLineaPedido.idProducto = this.products[value].id;
    this.tempLineaPedido.nombre = this.products[value].nombre;
    this.tempLineaPedido.descripcion = this.products[value].descripcion;
    this.tempLineaPedido.categorias = this.products[value].listaCategorias[0].nombre;
    this.tempLineaPedido.stock = this.products[value].stock;
    this.tempLineaPedido.cantidad = 1;
    this.tempLineaPedido.precioVenta = this.products[value].precioVenta;
    this.tempLineaPedido.impuestos = 1.21;
    this.tempLineaPedido.subtotal = Math.round( (this.tempLineaPedido.cantidad * this.tempLineaPedido.precioVenta * this.tempLineaPedido.impuestos) * 100 ) / 100; 

    this.misLineasDePedido.push(this.tempLineaPedido);
    this.observableLineasPedido$.next(Object.assign({}, this.misLineasDePedido));
    this.calcularPrecioTotal();
    }else{
      alert('no puedes insertar un producto ya insertado');
    }
  }


  public borrarLinea(IDLineaBorrar: number){
    this.misLineasDePedido.splice(IDLineaBorrar, 1);
    this.observableLineasPedido$.next(Object.assign({}, this.misLineasDePedido));
    this.calcularPrecioTotal();
  }



  public cantidadCambiada(idProducto: number, value : any){
    var nuevoValor : number = value.target.valueAsNumber;
    const updatedProduct = this.observableLineasPedido$.value[idProducto];
    if(nuevoValor > updatedProduct.stock){
      alert('no hay tanto stock');
      updatedProduct.cantidad = updatedProduct.stock;
    }else{
      if(nuevoValor <= 0){
        alert('Tienes que ser más positivo hermano. Paz.');
        updatedProduct.cantidad = 1;
      }else{
        updatedProduct.cantidad = nuevoValor;
      }
    }
    updatedProduct.subtotal = Math.round( (updatedProduct.cantidad * updatedProduct.precioVenta * 1.21) * 100 ) / 100;  
    const newProductData = {...this.observableLineasPedido$.value, [idProducto]:updatedProduct};
    this.observableLineasPedido$.next(newProductData);
    this.calcularPrecioTotal();
  }

  public subtotalcambiado(idProducto: number, value : any){
    var nuevoValor : number = value.target.valueAsNumber;
    const updatedProduct = this.observableLineasPedido$.value[idProducto];
    updatedProduct.subtotal = Math.round( nuevoValor * 100 ) / 100;   
    const newProductData = {...this.observableLineasPedido$.value, [idProducto]:updatedProduct};
    this.observableLineasPedido$.next(newProductData);
    this.calcularPrecioTotal();
  }

  public customerCambiado(customer_Seleccionado: any){
    this.customerSeleccionado = customer_Seleccionado;
  }

  public checkFechaOrder(fechaOrder: any){
    this.minDate = new Date(fechaOrder.value);
    this.dispatchDateDisabled = false;
  }

  private calcularPrecioTotal(){
    this.precioTotalPedido = 0;
    this.misLineasDePedido.forEach(lineas => {
      this.precioTotalPedido = this.precioTotalPedido + lineas.subtotal;
      this.precioTotalPedido = Math.round( this.precioTotalPedido * 100 ) / 100;
    });
    
  }

  
  public guardarPedido():void {
    //componer objeto pedido
    var pedido_para_guardar: Order = new Order();;

    pedido_para_guardar.id = this.idPedido;
    pedido_para_guardar.idCliente = this.customerSeleccionado;
    pedido_para_guardar.totalPedido = this.precioTotalPedido;
    pedido_para_guardar.nombreVendedor = this.vendorName;
    pedido_para_guardar.fechaPedido = new Date("2020/01/01");
    pedido_para_guardar.fechaEntrega = new Date("2020/01/01");

    //mandarlo al servicio
    this.miOrderService.guardarPedido(pedido_para_guardar).subscribe(
      response => {this.idPedido = response, 
        /*alert('respuesta '+ response), */
        /*alert('idPedido '+this.idPedido),*/
        this.guardarLineas()
      }
    );
  }

  private guardarLineas(){
    const calls = [];
    this.misLineasDePedido.forEach(
      linea => {
        var lineaPedidoParaPOST_ : lineaPedidoPost = new lineaPedidoPost();
        lineaPedidoParaPOST_.idPedido = this.idPedido;
        lineaPedidoParaPOST_.idProducto = linea.idProducto;
        lineaPedidoParaPOST_.precioUnitario = linea.precioVenta;
        lineaPedidoParaPOST_.cantidad = linea.cantidad;
        lineaPedidoParaPOST_.impuestos = linea.impuestos;
        lineaPedidoParaPOST_.subtotal = linea.subtotal;

        calls.push(this.miOrderService.guardarLineasPedido(lineaPedidoParaPOST_));
      }
    );
    forkJoin(calls).subscribe(responses => {/*console.log(responses)*/
      alert('Pedido guardado')
      
      //navegar a order detail de la idPedido guardada
      this.router.navigate(['/detail/'+this.idPedido]);
    });
  }
}

