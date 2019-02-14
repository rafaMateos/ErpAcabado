

export interface IOrder {
    customer:     string;
    supplier:     string;
    orderDate:    string;
    dispatchDate: string;
    productList:  IProduct[];
}

export interface IProduct {
    name:        string;
    description: string;
    category:    string;
    units:       number;
    unitPrice:   number;
    taxes:       number;
    subTotal:    number;
}
