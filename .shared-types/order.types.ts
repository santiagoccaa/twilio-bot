export type CardType = "credito" | "debito";
export type PaymentMethod = "transferencia" | CardType | "efectivo_local";
export type StatusOder =
  | "recibida"
  | "en_preparacion"
  | "en_camino"
  | "entregada";
export type StatusPay = "pendiente" | "completado" | "fallido";

export interface ItemsOrder {
  quantity: number;
  unitPrice: number;
  notes: string[];
}

export interface UserInformation {
  name: string;
  address: string;
  phone: string;
}

export interface Payment {
  method: PaymentMethod;
  status: StatusPay;
}

export interface AddOrderRequest {
  items: ItemsOrder[];

  totalAmount: number;

  userInformation: UserInformation;

  payment: Payment;

  status: StatusOder;
}
