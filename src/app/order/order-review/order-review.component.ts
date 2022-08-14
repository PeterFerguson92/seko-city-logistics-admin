import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.css']
})
export class OrderReviewComponent implements OnInit {
  order;
  constructor() { }

  ngOnInit(): void {
    this.order = JSON.parse('{"customer":{"type":"PERSONAL","registeredName":"","registeredNumber":"","title":"Mr","name":"sef","surname":"dsfdsf","countryCode":"+44","phone":"07948212772","email":"","postcode":"MK109Ld","address":"2 Watkin Terrace, , , , , Northampton, Northamptonshire","country":"UNITED KINGDOM","reference":null,"role":"SENDER"},"info":{"deliveryDate":"2022-08-14T00:00:00.000Z","deliveryTime":"MORNING","deliveryPostCode":"se193ty","deliveryAddress":"12 Watkin Terrace, , , , , Northampton, Northamptonshire","updatesViaWhatsapp":true,"updatesViaEmail":true,"paymentType":"BANK TRANSFER","paymentStatus":"NOT PAID","paymentNotes":"07948212772","totalAmount":40,"amountPaid":0,"amountOutstanding":40,"items":[{"type":"BARRELS","pricePerUnit":40,"quantity":1,"amount":40}]}}')
    console.log(this.order)
  }

  updateOrder(data) {
    const x = JSON.stringify(data);
    console.log(x)
    this.order = data
  }

}
