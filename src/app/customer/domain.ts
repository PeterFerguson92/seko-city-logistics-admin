export interface ICustomersResponse {
  customers: [ICustomer];
}

export interface ICustomer {
  // id: number;
  uuid: string;
  fullName: string;
  address: string;
  postcode: string;
  phone: string;
  email: string;
  country: string;
  type: string;
  destination: string;
  // createdAt: Date;
  // updateAt: Date;
}

export interface IUpdateFieldInput {
  name: string;
  value: string;
}
