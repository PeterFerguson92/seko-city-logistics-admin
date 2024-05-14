import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';

@Component({
    selector: 'app-booking-review',
    templateUrl: './booking-review.component.html',
    styleUrls: ['./booking-review.component.css'],
})
export class BookingReviewComponent implements OnInit {
    booking = {
        sender: {
            type: '',
            title: '',
            name: '',
            surname: '',
            countryCode: '',
            phone: '',
            email: '',
            postcode: '',
            address: '',
            country: '',
        },
        receiver: {
            receivers: [
                {
                    type: '',
                    title: '',
                    name: '',
                    surname: '',
                    countryCode: '',
                    phone: '',
                    destination: '',
                    location: '',
                },
            ],
            destinationInfo: { destination: '', location: '' },
        },
        itemsDetails: {
            items: [{ quantity: 0, type: '', description: '', value: '', pricePerUnit: '', amount: 0 }],
            paymentInfo: {
                paymentType: '',
                paymentStatus: '',
                paymentNotes: '',
                amountPaid: '',
                amountOutstanding: '',
                discountAmount: 4,
                discountReason: 'REASON 1',
                discountType: 'AMOUNT',
                fullAmount: 0,
                totalAmount: 0,
                isDiscountApplied: false,
            },
            totalNumberOfItems: 0,
        },
        info: {
            date: '',
            time: '',
            timeNotes: '',
            postcode: '',
            address: '',
            updatesViaWhatsapp: '',
            updatesViaEmail: '',
            useCustomerAddress: '',
        },
    };
    panelOpenState = false;
    data;

    constructor(private commonService: CommonService) {}

    ngOnInit(): void {
        // console.log(this.booking)
        // tslint:disable-next-line:max-line-length
        // this.booking = JSON.parse('{"customer":{"__typename":"Customer","id":4,"reference":"CUK-39219-BS5","title":"Mr","name":"Comfort","surname":"bo","fullName":"Mr Comfort bo","email":"jrferguson41@gmail.com","countryCode":"+44","phone":"07948212772","fullPhoneNumber":"+447948212772","postcode":"DE22 3UF","address":"14 Watkin Terrace, , , , , Northampton, Northamptonshire","displayAddress":"14 Watkin Terrace, , , , , Northampton, Northamptonshire DE22 3UF","country":"UNITED KINGDOM","type":"BUSINESS","location":"","destination":"","role":"","registeredName":"God Miracle","registeredNumber":"10"},"sender":{"type":"BUSINESS","registeredName":"God Miracle","registeredNumber":"10","title":"Mr","name":"Comfort","surname":"bo","countryCode":"+44","phone":"07948212772","email":"jrferguson41@gmail.com","postcode":"DE22 3UF","address":"14 Watkin Terrace, , , , , Northampton, Northamptonshire","country":"UNITED KINGDOM","reference":"CUK-39219-BS5","role":"SENDER"},"receiver":{"receivers":[{"type":"PERSONAL","registeredName":"","registeredNumber":"","title":"Mr","name":"Franklin ","surname":"Amoah","countryCode":"+44","phone":"7496682880"},{"type":"BUSINESS","registeredName":"Tesci","registeredNumber":"1111","title":"Mr","name":"Abigail","surname":"Amoah-Korsa","countryCode":"+44","phone":"07588005008"},{"type":"CHARITY","registeredName":"God Is Good ent","registeredNumber":"1111","title":"Mr","name":"thomas","surname":"antwi","countryCode":"+44","phone":"07588005008"}],"destinationInfo":{"destination":"KUMASI","location":"Atonsu"}},"itemsDetails":{"items":[{"quantity":1,"type":"SMALL BOX","description":"","value":"132","pricePerUnit":"30","amount":30},{"quantity":"6","type":"SMALL BOX","description":"","value":"223","pricePerUnit":"30","amount":180},{"quantity":1,"type":"OTHER","description":"pampers","value":"30","pricePerUnit":"232","amount":"12"}],"paymentInfo":{"paymentType":"DIRECT DEBIT","paymentStatus":"COMPLETE","notes":"to pay","totalAmount":222},"totalNumberOfItems":8},"info":{"date":"31/03/2022","time":"AFTERNOON","postcode":"se193ty","address":"12 Watkin Terrace, , , , , Northampton, Northamptonshire","updatesViaWhatsapp":true}}')
        // console.log(this.booking)
    }

    updateBook(data) {
        this.booking = data;
    }

    isCustomerPersonal(customerType) {
        return this.commonService.isCustomerPersonal(customerType);
    }

    getFormattedDate(date) {
        return date === null ? 'TBD' : this.commonService.getFormattedDate(date);
    }
}
