import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PERSONAL_CUSTOMER_TYPE } from '../constants';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  getAddressesByPostcode(postcode: string) {
      return ['10 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '12 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '14 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '16 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '18 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '2 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '20 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '22 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '24 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '26 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '26a Watkin Terrace, , , , , Northampton, Northamptonshire',
        '26b Watkin Terrace, , , , , Northampton, Northamptonshire',
        '26c Watkin Terrace, , , , , Northampton, Northamptonshire',
        '26d Watkin Terrace, , , , , Northampton, Northamptonshire',
        '28 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '2a Watkin Terrace, , , , , Northampton, Northamptonshire',
        '30 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '32 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '36 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '38 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '4 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '40 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '40b Watkin Terrace, , , , , Northampton, Northamptonshire',
        '42 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '44 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '46 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '48 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '50 Watkin Terrace, , , , , Northampton, Northamptonshire',
        '8 Watkin Terrace, , , , , Northampton, Northamptonshire',
        'Flat 1, 6 Watkin Terrace, , , , Northampton, Northamptonshire',
        'Flat 1, Watkin Court, Watkin Terrace, , , Northampton, Northamptonshire',
        'Flat 2, 6 Watkin Terrace, , , , Northampton, Northamptonshire',
        'Flat 2, Watkin Court, Watkin Terrace, , , Northampton, Northamptonshire',
        'Flat 3, 6 Watkin Terrace, , , , Northampton, Northamptonshire',
        'Flat 3, Watkin Court, Watkin Terrace, , , Northampton, Northamptonshire',
        'Flat 4, 6 Watkin Terrace, , , , Northampton, Northamptonshire',
        'Flat 4, Watkin Court, Watkin Terrace, , , Northampton, Northamptonshire',
        'Flat 5, Watkin Court, Watkin Terrace, , , Northampton, Northamptonshire',
        'Flat 6, Watkin Court, Watkin Terrace, , , Northampton, Northamptonshire',
        'Flat 7, Watkin Court, Watkin Terrace, , , Northampton, Northamptonshire',
        'Flat 8, Watkin Court, Watkin Terrace, , , Northampton, Northamptonshire',
        'Flat 9, Watkin Court, Watkin Terrace, , , Northampton, Northamptonshire']
  }

  getFormattedPhoneNumber(countryCode: string, phoneNumber: string) {
    const prefix = countryCode + ' ';
    return phoneNumber.startsWith('0') ? phoneNumber.replace(phoneNumber.substring(0, 1), prefix) : prefix + phoneNumber;
  }

  getFormattedDate(dateTime: string) {
    const date = new Date(dateTime) // formated_Date - SDK returned date

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  getFormattedIsoDate(date: string) {
    const newDate = new Date(date + ' GMT');
    newDate.setUTCHours(0,0,0,0);
    return newDate.toISOString();
  }

  isCustomerPersonal(customerType:string) {
    return PERSONAL_CUSTOMER_TYPE === customerType;
  }

}
