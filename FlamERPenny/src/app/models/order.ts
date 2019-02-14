import { Product } from './product';

export class Order {

    id: number;
    idCliente: number;
    nombreVendedor: string;
    fechaPedido: Date;
    fechaEntrega: Date;
    totalPedido: number;
}
