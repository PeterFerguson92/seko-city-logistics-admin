import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-review',
  templateUrl: './booking-review.component.html',
  styleUrls: ['./booking-review.component.css']
})
export class BookingReviewComponent implements OnInit {
  booking = {
    sender2: { type: '', fullName: '', code: '', phone: '', email: '', postcode: '', address: '', country: '' },
    receiver: { type: '', fullName: '', code: '', phone: '', destination: '', otherDestination: '' },
    itemsDetails: {
      items: [{ quantity: 0, type: '', description: '', value: '', pricePerUnit: '', amount: 0 }],
      paymentInfo: { paymentType: '', paymentStatus: '', notes: '', totalAmount: '' },
      totalNumberOfItems: 0
    },
    info: { date: '', time: '', postcode: '', address: '', updatesViaWhatsapp: '' }
  };
  panelOpenState = false;
  data;

  constructor() { }

  ngOnInit(): void {
    console.log(this.booking)
    // tslint:disable-next-line:max-line-length
    // this.booking = JSON.parse('{"sender":{"__typename":"Customer","id":50,"fullName":"sarah boateng3","address":"44 Watkin Terrace, , , , , Northampton, Northamptonshire","postcode":"mk13 3qr","phone":"+44 7496682880","email":"sarah.1@gmail.com","country":"UNITED KINGDOM","type":"BUSINESS","uuid":"CUK-75737-BS10"},"sender2":{"type":"BUSINESS","fullName":"sarah antwi","code":"+44","phone":"7496682880","email":"sarah.1@gmail.com","postcode":"mk13 3qr","address":"44 Watkin Terrace, , , , , Northampton, Northamptonshire","country":"UNITED KINGDOM"},"receiver":{"type":"PERSONAL","fullName":"tomas agyemang","code":"+233","phone":"209849920","destination":"ACCRA","otherDestination":""},"items":{"items":[{"quantity":"2","type":"MEDIUM BOX","description":"","value":"454","pricePerUnit":50,"amount":100},{"quantity":"3","type":"BIG BOX","description":"","value":"10","pricePerUnit":70,"amount":210},{"quantity":"2","type":"OTHER","description":"Pampers","value":"454","pricePerUnit":"91","amount":"10"}],"paymentInfo":{"paymentType":"DIRECT DEBIT","paymentStatus":"COMPLETE","notes":"to pay on the 1st of the month","totalAmount":"100"}, "totalNumberOfItems":"5"},"info":{"date":"21/03/2022","time":"MORNING","postcode":"se19 3ty","address":"16 Watkin Terrace, , , , , Northampton, Northamptonshire","updatesViaWhatsapp":true}}')
    console.log(this.booking)
  }

  updateBook(data) {
    this.booking = data
  }

}
