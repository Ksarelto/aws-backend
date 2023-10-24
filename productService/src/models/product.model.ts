export interface IProduct {
  description: string;
  id: string;
  price: number;
  title: string;
  imageUrl?: string;
}

export interface IRequestProduct {
  count: number;
  description: string;
  price: number;
  title: string;
  imageUrl?: string;
}

export interface IResponseProduct extends IProduct {
  count: number;
}
