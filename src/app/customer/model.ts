export interface ICustomersResponse {
  customers: [ICustomer];
}

export interface ICustomer {
  reference: string;
  title: string;
  name: string;
  surname: string;
  fullName: string;
  email: string;
  postcode: string;
  address: string;
  displayAddress: string;
  countryCode: string;
  phone: string;
  fullPhoneNumber: string;
  country: string;
  type: string;
  registeredName: string;
  registeredNumber: string;
  role: string;
}

export interface IUpdateFieldInput {
  name: string;
  value: string;
}
