import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  FULL_PAYMENT_STATUS_ALIAS, NO_PAYMENT_PAYMENT_STATUS_ALIAS,
  ORDER_ITEMS, ORDER_ITEMS_TYPES_DISPLAY_NAMES, ORDER_PICKUP_TIMES, PARTIAL_PAYMENT_STATUS_ALIAS, PAYMENT_STATUSES, PAYMENT_TYPES
} from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService } from 'src/app/service/validation/validation.service';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.css', '../../shared/shared-new-form.css']
})
export class OrderInfoComponent implements OnInit, AfterViewInit {
  @Input() orderInfo;

  orderInfoForm: FormGroup;
  times = ORDER_PICKUP_TIMES;
  addresses = [];
  formValidationMap = { postcode: '' };
  paymentTypes = PAYMENT_TYPES
  paymentStatuses = PAYMENT_STATUSES;
  types = ORDER_ITEMS_TYPES_DISPLAY_NAMES;


  get items(): FormArray {
    return this.orderInfoForm.get('items') as FormArray;
  }

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog,private commonService: CommonService,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.orderInfoForm = this.formBuilder.group({
      date: [this.orderInfo.deliveryDate ? new Date(this.orderInfo.deliveryDate ) : new Date(), [Validators.required]],
      time: [this.orderInfo.deliveryTime ? this.orderInfo.deliveryTime :  this.times[0], [Validators.required]],
      postcode: [this.orderInfo.deliveryPostCode ? this.orderInfo.deliveryPostCode : '',
      [Validators.required, this.validationService.postCodeValidator]],
      address: [this.orderInfo.deliveryAddress ? this.orderInfo.deliveryAddress : '', [Validators.required]],
      updatesViaWhatsapp: [this.orderInfo.updatesViaWhatsapp === null ? this.orderInfo.updatesViaWhatsapp : true, [Validators.required]],
      updatesViaEmail: [this.orderInfo.updatesViaEmail === null ? this.orderInfo.updatesViaEmail : true, [Validators.required]],
      paymentType: [this.orderInfo.paymentType ? this.orderInfo.paymentType : this.paymentTypes[0] , [Validators.required]],
      paymentStatus: [this.orderInfo.paymentStatus ? this.orderInfo.paymentStatus : this.paymentStatuses[0], Validators.required],
      paymentNotes: [this.orderInfo.paymentNotes ? this.orderInfo.paymentNotes : '', []],
      totalAmount: [this.orderInfo.totalAmount ? this.orderInfo.totalAmount : 0,  []],
      amountPaid: [this.orderInfo.amountPaid ? this.orderInfo.amountPaid : 0, []],
      amountOutstanding: [this.orderInfo.amountOutstanding ? this.orderInfo.amountOutstanding : 0, []],
      items: this.formBuilder.array([this.buildItemGroup(null)])
    })
    this.getFormControl('totalAmount').disable();
    this.getFormControl('amountPaid').disable();
    this.getFormControl('amountOutstanding').disable();
    this.initializeProperties(0);
    this.updateTotalAmount()

  }

  buildItemGroup(item): FormGroup {
    return this.formBuilder.group({
      type: [this.types[0], [Validators.required]],
      pricePerUnit: [this.getPricePerUnit(this.types[0])],
      quantity: [1],
      amount: [0]
    })
  }

  initializeProperties(index) {
    this.getItemsFormControl('pricePerUnit', index).disable()
    this.getItemsFormControl('amount', index).disable();
    this.updateItemTotalAmount(index)
  }

  setPaymentProperties(paymentStatus: string) {
    const totalAmountControl =  this.getFormControl('totalAmount');
    const amountPaidControl =  this.getFormControl('amountPaid');
    const outstandingPaidControl =  this.getFormControl('amountOutstanding');

    switch(paymentStatus) {
      case FULL_PAYMENT_STATUS_ALIAS:
        amountPaidControl.setValue(totalAmountControl.value);
        outstandingPaidControl.setValue(0);
        amountPaidControl.disable();
        break;
      case PARTIAL_PAYMENT_STATUS_ALIAS:
        outstandingPaidControl.setValue(outstandingPaidControl.value)
        amountPaidControl.enable();
        break;
      case NO_PAYMENT_PAYMENT_STATUS_ALIAS:
        amountPaidControl.setValue(0);
        amountPaidControl.disable();
        break;
    }

  }

  updateItemTotalAmount(index) {
    const itemPricePerUnit = this.getItemsFormControl('pricePerUnit', index).value;
    const itemQuantity = this.getItemsFormControl('quantity', index).value;

    this.getItemsFormControl('amount', index).setValue(itemPricePerUnit * itemQuantity);
    this.getItemsFormControl('amount', index).markAsDirty();
    this.updateTotalAmount();
    this.updateOutstandingAmount()

  }

  ngAfterViewInit(): void {
    this.validateFormControl('postcode');
  }

  getFormControl(fControlName: string) {
    return this.orderInfoForm.get(fControlName)
  }

  validateFormControl(fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(() => {
        this.formValidationMap[fControlName] = this.validationService.getValidationMessage(fControl, fControlName);
      });
  }

  onInputChange(event, fControlName) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event)
    fControl.markAsDirty();
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    const data = fControlName === 'updatesViaWhatsapp' ||  fControlName === 'updatesViaEmail'? event.checked : event.value;
    fControl.setValue(data);
    fControl.markAsDirty();
    if (fControlName === 'paymentStatus')
    {
      this.setPaymentProperties(event.value)
    }
  }

  onItemsSelectionChange(event: any, fControlName: string, index: number) {
    const fControl = this.getItemsFormControl(fControlName, index);
    fControl.setValue(event.value);
    fControl.markAsDirty();
    this.getItemsFormControl('pricePerUnit', index).setValue(this.getPricePerUnit(fControl.value));
    this.updateItemTotalAmount(index)
    this.updateTotalAmount();
  }

  onAddItem() {
    this.items.push(this.buildItemGroup(null));
    this.initializeProperties(this.items.length - 1);
    this.updateTotalAmount();
    this.updateOutstandingAmount()
  }

  onDeleteItem(index) {
    if (this.items.length > 1)
    {
      this.items.removeAt(index)
      this.updateTotalAmount();
      this.updateOutstandingAmount()
    }
  }

  getItemsFormControl(fControlName: string, index: number) {
    const fControl = this.items.controls[index];
    return fControl.get(fControlName)
  }

  getAddressByPostcode() {
    const postcodeFormControl = this.getFormControl('postcode');
    if (!postcodeFormControl.invalid)
    {
      this.addresses = this.commonService.getAddressesByPostcode(postcodeFormControl.value);
      return this.addresses;
    }
  }

  getPricePerUnit(selection: string) {
    let price = null;
    ORDER_ITEMS.forEach((element) => {
      if (element.DISPLAY_NAME === selection)
      {
        price = parseInt(element.PRICE, 10);
      }
    });

    return price;
  }

  getInfoDetails() {
    const info: any = { date: '', time: '', postcode: '', address: '', updatesViaWhatsapp: '',updatesViaEmail: '' }
    Object.entries(info).forEach((key) => {
      const attributeName = key[0];
      if (attributeName === 'date')
      {
        info[attributeName] = this.commonService.getFormattedIsoDate(this.getFormControl(attributeName).value);
      } else
      {
        info[attributeName] = this.getFormControl(attributeName).value;
      }
    })
    return info;
  }

  isDeleteDisabled() {
    return this.items.length === 1;
  }

  updateTotalAmount() {
    let totalAmount = 0
    this.items.controls.forEach((control) => {
      totalAmount = totalAmount + control.get('amount').value;
    });

    this.getFormControl('totalAmount').setValue(totalAmount);
  }

  updateOutstandingAmount() {
    const totalAmountControl = this.getFormControl('totalAmount');
    const amountPaidControl = this.getFormControl('amountPaid');
    const outstandingPaidControl = this.getFormControl('amountOutstanding');
    if (parseInt(amountPaidControl.value, 10) <= 0)
    {
      amountPaidControl.setValue(0);
      outstandingPaidControl.setValue(totalAmountControl.value);
      this.getFormControl('paymentStatus').setValue(NO_PAYMENT_PAYMENT_STATUS_ALIAS)
    } else
    {
      if (amountPaidControl.value >= totalAmountControl.value)
      {
        amountPaidControl.setValue(totalAmountControl.value);
        this.getFormControl('paymentStatus').setValue(FULL_PAYMENT_STATUS_ALIAS)
        outstandingPaidControl.setValue(0);
      } else
      {
        this.getFormControl('paymentStatus').setValue(PARTIAL_PAYMENT_STATUS_ALIAS)
        outstandingPaidControl.setValue(totalAmountControl.value - amountPaidControl.value);
      }
    }
  }

}
