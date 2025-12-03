export interface IVariantsMini {
  _id: string;
  format: string;
}

export interface IOrderItem {
  product_id: IProductsMini;
  variant_id?: IVariantsMini;
  name: string;
  image: string;
  quantity: number;
  price: number;
}
export interface IProductsMini{
  _id:string
  name:string
  imageUrl:string
}


export interface IAddress {
  city: string;
  district: string;
  detail: string;
}

export interface IUserShort {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber: string
}

export interface IDiscountShort {
  _id: string;
  code: string;
  value: number;
  type: string; // nếu bạn có field này
}

export interface IOrder {
  _id: string;
  user_id: IUserShort | string;
  address: IAddress;
  addressNote?: string;
  shippingMethod: string
  paymentMethod:string
  status:string
  paymentStatus: string
  note?: string;
  items: IOrderItem[];
  totalAmount: number;
  shippingFee: number;
  discount_id?: IDiscountShort | string | null;
  createdAt: string;
  updatedAt: string;
}
