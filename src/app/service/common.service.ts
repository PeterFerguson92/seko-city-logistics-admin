import { Injectable } from '@angular/core';
import { PERSONAL_CUSTOMER_TYPE } from '../constants';
import { GET_ACTIVITY_AVAILABILITY, GET_ADDRESSES_BY_POSTCODE, GET_KEY } from './request';
import { Apollo } from 'apollo-angular';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private apollo: Apollo) { }

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

  getAddresses(postcode: string) {
    return this.apollo.query<any>({
      query: GET_ADDRESSES_BY_POSTCODE,
      variables: {postcode}
    });
  }

  getActivityAvailability(date: string) {
    return this.apollo.query<any>({
      query: GET_ACTIVITY_AVAILABILITY,
      variables: {date}
    });
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

  getTimeStamp(dateToTimeStamp) {
    const date = new Date();
    date.setTime(dateToTimeStamp);
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    const formattedToday = dd + '_' + mm + '_' + yyyy;
    return formattedToday;
  }

  isCustomerPersonal(customerType:string) {
    return PERSONAL_CUSTOMER_TYPE === customerType;
  }

  getKeys() {
    return this.apollo.query<any>({
      query: GET_KEY,
    });
  }

  encryptMessage(message, encryptionKey): string {
    return CryptoJS.AES.encrypt(message, encryptionKey).toString();
  }

  decryptMessage(message, encryptionKey): string {
    return CryptoJS.AES.decrypt(message,  encryptionKey).toString(CryptoJS.enc.Utf8);
  }

}
