
/* Defines the address entity */
export interface AddressResponse {
  latitude: number,
  longitude: number,
  addresses: [string]
}

export interface IUpdateFieldInput {
  name: string;
  value: string;
}
