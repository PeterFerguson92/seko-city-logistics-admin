import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-booking-review',
  templateUrl: './booking-review.component.html',
  styleUrls: ['./booking-review.component.css']
})
export class BookingReviewComponent implements OnInit {
  booking = {
    sender: { type: '', title: '', name: '', surname: '', countryCode: '', phone: '', email: '', postcode: '', address: '', country: '' },
    receiver: {
      receivers: [{ type: '', title: '', name: '', surname: '', countryCode: '', phone: '', destination: '', location: '' }],
      destinationInfo: { destination: '', location: '' }
    },
    itemsDetails: {
      items: [{ quantity: 0, type: '', description: '', value: '', pricePerUnit: '', amount: 0 }],
      paymentInfo: { paymentType: '', paymentStatus: '', notes: '', totalAmount: '' },
      totalNumberOfItems: 0
    },
    info: { date: '', time: '', postcode: '', address: '', updatesViaWhatsapp: '' }
  };
  panelOpenState = false;
  data;

  constructor(private commonService:CommonService) { }

  ngOnInit(): void {
    // console.log(this.booking)
    // tslint:disable-next-line:max-line-length
    // this.booking = JSON.parse('{\n\t"customer": {\n\t\t"__typename": "Customer",\n\t\t"id": 4,\n\t\t"reference": "CUK-39219-BS5",\n\t\t"title": "Mr",\n\t\t"name": "Comfort",\n\t\t"surname": "bo",\n\t\t"fullName": "Mr Comfort bo",\n\t\t"email": "jrferguson41@gmail.com",\n\t\t"countryCode": "+44",\n\t\t"phone": "07948212772",\n\t\t"fullPhoneNumber": "+447948212772",\n\t\t"postcode": "DE22 3UF",\n\t\t"address": "14 Watkin Terrace, , , , , Northampton, Northamptonshire",\n\t\t"displayAddress": "14 Watkin Terrace, , , , , Northampton, Northamptonshire DE22 3UF",\n\t\t"country": "UNITED KINGDOM",\n\t\t"type": "BUSINESS",\n\t\t"location": "",\n\t\t"destination": "",\n\t\t"role": "",\n\t\t"registeredName": "God Miracle",\n\t\t"registeredNumber": "10"\n\t},\n\t"sender": {\n\t\t"type": "BUSINESS",\n\t\t"registeredName": "God Miracle",\n\t\t"registeredNumber": "10",\n\t\t"title": "Mr",\n\t\t"name": "Comfort",\n\t\t"surname": "bo",\n\t\t"countryCode": "+44",\n\t\t"phone": "07948212772",\n\t\t"email": "jrferguson41@gmail.com",\n\t\t"postcode": "DE22 3UF",\n\t\t"address": "14 Watkin Terrace, , , , , Northampton, Northamptonshire",\n\t\t"country": "UNITED KINGDOM",\n\t\t"reference": "CUK-39219-BS5",\n\t\t"role": "SENDER"\n\t},\n\t"receiver": {\n\t\t"receivers": [{\n\t\t\t"type": "PERSONAL",\n\t\t\t"registeredName": "",\n\t\t\t"registeredNumber": "",\n\t\t\t"title": "Mr",\n\t\t\t"name": "Peter ",\n\t\t\t"surname": "Mensah",\n\t\t\t"countryCode": "+44",\n\t\t\t"phone": "7948212772"\n\t\t}, {\n\t\t\t"type": "BUSINESS",\n\t\t\t"registeredName": "tesco",\n\t\t\t"registeredNumber": "1131313",\n\t\t\t"title": "Mr",\n\t\t\t"name": "Francis",\n\t\t\t"surname": "Amoah",\n\t\t\t"countryCode": "+44",\n\t\t\t"phone": "7948212772"\n\t\t}],\n\t\t"destinationInfo": {\n\t\t\t"destination": "ACCRA",\n\t\t\t"location": "Dansoma"\n\t\t}\n\t},\n\t"itemsDetails": {\n\t\t"items": [],\n\t\t"paymentInfo": {\n\t\t\t"paymentType": "",\n\t\t\t"paymentStatus": "",\n\t\t\t"notes": "",\n\t\t\t"totalAmount": 0\n\t\t},\n\t\t"totalNumberOfItems": 0\n\t},\n\t"info": {\n\t\t"date": "21/03/2022",\n\t\t"time": "MORNING",\n\t\t"postcode": "se193ty",\n\t\t"address": "12 Watkin Terrace, , , , , Northampton, Northamptonshire",\n\t\t"updatesViaWhatsapp": true\n\t}\n}')
    // console.log(this.booking)
  }

  updateBook(data) {
    console.log(JSON.stringify(data))
    this.booking = data
  }

  isCustomerPersonal(customerType) {
    return this.commonService.isCustomerPersonal(customerType)
  }

}
