import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AvailabilityDialogComponent } from 'src/app/booking/availability-dialog/availability-dialog.component';
import {
  FULL_PAYMENT_STATUS_ALIAS, NO_PAYMENT_PAYMENT_STATUS_ALIAS,
  ORDER_ITEMS, ORDER_ITEMS_TYPES_DISPLAY_NAMES, ORDER_PICKUP_TIMES,
  PARTIAL_PAYMENT_STATUS_ALIAS, PAYMENT_STATUSES, PAYMENT_TYPES
} from 'src/app/constants';
import { ItemService } from 'src/app/items/item.service';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService } from 'src/app/service/validation/validation.service';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';

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
    private validationService: ValidationService, private itemService: ItemService) { }

  ngOnInit(): void {
    this.orderInfoForm = this.formBuilder.group({
      deliveryDate: [this.orderInfo.deliveryDate ? new Date(this.orderInfo.deliveryDate ) : new Date(), [Validators.required]],
      deliveryTime: [this.orderInfo.deliveryTime ? this.orderInfo.deliveryTime :  this.times[0], [Validators.required]],
      deliveryPostCode: [this.orderInfo.deliveryPostCode ? this.orderInfo.deliveryPostCode : '',
      [Validators.required, this.validationService.postCodeValidator]],
      deliveryAddress: [this.orderInfo.deliveryAddress ? this.orderInfo.deliveryAddress : '', [Validators.required]],
      updatesViaWhatsapp: [this.orderInfo.updatesViaWhatsapp === null ? this.orderInfo.updatesViaWhatsapp : true, [Validators.required]],
      updatesViaEmail: [this.orderInfo.updatesViaEmail === null ? this.orderInfo.updatesViaEmail : true, [Validators.required]],
      paymentType: [this.orderInfo.paymentType ? this.orderInfo.paymentType : this.paymentTypes[0] , [Validators.required]],
      paymentStatus: [this.orderInfo.paymentStatus ? this.orderInfo.paymentStatus : this.paymentStatuses[0], Validators.required],
      paymentNotes: [this.orderInfo.paymentNotes ? this.orderInfo.paymentNotes : '', []],
      totalAmount: [this.orderInfo.totalAmount ? this.orderInfo.totalAmount : 0,  []],
      amountPaid: [this.orderInfo.amountPaid ? this.orderInfo.amountPaid : 0, []],
      amountOutstanding: [this.orderInfo.amountOutstanding ? this.orderInfo.amountOutstanding : 0, []],
      items: this.formBuilder.array([])
    })

    this.getAddressByPostcode()
    if (this.getFormControl('paymentStatus').value === PARTIAL_PAYMENT_STATUS_ALIAS)
    {
      this.getFormControl('amountPaid').enable();
    } else
    {
      this.getFormControl('amountPaid').disable();
    }
    this.getFormControl('totalAmount').disable();
    this.getFormControl('amountOutstanding').disable();
    this.initializeProperties(0);
    this.updateTotalAmount()

    if (this.orderInfo.reference)
    {
      this.getOrderItems()
    } else
    {
      this.items.push(this.buildItemGroup(null));
      this.initializeProperties(0);
      // this.updateTotalAmount();
    }
  }

  buildItemGroup(item): FormGroup {
    return this.formBuilder.group({
      id: [item ? item.id : null ],
      type: [item ? item.type : this.types[0], [Validators.required]],
      pricePerUnit: [item ? item.pricePerUnit : this.getPricePerUnit(this.types[0])],
      quantity: [item ? item.quantity : 1],
      amount: [item ? item.amount : this.getPricePerUnit(this.types[0]) * 1]
    })
  }

  initializeProperties(index) {
    if (this.items.length > 0)
    {
      this.getItemsFormControl('pricePerUnit', index).disable()
      this.getItemsFormControl('amount', index).disable();
      this.updateItemTotalAmount(index)
    }
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
        outstandingPaidControl.setValue(outstandingPaidControl.value);
        amountPaidControl.setValue(this.orderInfo.amountPaid)
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
    this.updateOutstandingAmount();
  }

  ngAfterViewInit(): void {
    this.validateFormControl('deliveryPostCode');
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
    const data = fControlName === 'updatesViaWhatsapp' || fControlName === 'updatesViaEmail' ? event.checked : event.value;
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
      const dialogRef = this.dialog.open(DialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'true')
        {
          this.items.removeAt(index)
          this.updateTotalAmount();
          this.updateOutstandingAmount()
        }
      })
    }
  }

  onPostcodeChange() {
    this.getAddressByPostcode()
  }

  getItemsFormControl(fControlName: string, index: number) {
    if (this.items.length > 0)
    {
      const fControl = this.items.controls[index];
      return fControl.get(fControlName)
    }
  }

  getAddressByPostcode() {
    const postcodeFormControl = this.getFormControl('deliveryPostCode');
    if (!postcodeFormControl.invalid)
    {
      this.commonService.getAddresses(postcodeFormControl.value).subscribe(
        ({ data }) => {
          this.addresses = data.addressesInfo.addresses;
        },
        error => {
          console.log(error);
        }
      );
    } else
    {
      this.addresses = [];
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
  isDisabled() {
    return !this.orderInfoForm.valid;
  }

  showWarning() {
    return !this.orderInfoForm.valid;
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

  getOrderInfoDetails() {
    const orderInfoDetails: any = {};
    Object.keys(this.orderInfoForm.controls).forEach(key => {
      const formControl = this.orderInfoForm.controls[key];
      if (key === 'items')
      {
       const itemsData = this.getOrderItemsInfoDetails();
        orderInfoDetails.items = itemsData.itemsInfo;
        orderInfoDetails.numberOfItems = itemsData.numberOfItems;
      } else
      {
        if (key === 'deliveryDate')
        {
          orderInfoDetails[key] = this.commonService.getFormattedIsoDate(formControl.value);
        } else
        {
          if (key === 'amountPaid')
          {
            orderInfoDetails[key] = parseInt(formControl.value, 10);
          } else
          {
            orderInfoDetails[key] = formControl.value;
          }
        }
      }
    });

    return orderInfoDetails;
  }

  getOrderItemsInfoDetails() {
    const itemsInfo = [];
    let numberOfItems = 0;
    this.items.controls.forEach((control) => {
      itemsInfo.push({
        id: control.get('id').value,
        type: control.get('type').value,
        pricePerUnit: parseInt(control.get('pricePerUnit').value, 10),
        quantity: parseInt(control.get('quantity').value, 10),
        amount: parseInt(control.get('amount').value, 10),
      })
      numberOfItems = numberOfItems + parseInt(control.get('quantity').value, 10)
    })
    // itemsInfo[numberOfItems] = numberOfItems;
    return { itemsInfo, numberOfItems };
  }

  getOrderItems() {
    this.itemService.getItemsByOrderReference(this.orderInfo.reference).subscribe(
      ({ data }) => {
        const itemsData = data.itemsByOrderReference;
        itemsData.forEach(item => {
          this.items.push(this.buildItemGroup(item));
          this.initializeProperties(this.items.length - 1)
        }
      );
        this.updateTotalAmount();
      },
      error => {
        console.log(error);
      }
    );
  }

  onCheckAvailabilty() {
    this.dialog.open(AvailabilityDialogComponent, {
      height: '50%',
      width: '60%',
      data: { date: this.commonService.getFormattedIsoDate(this.getFormControl('deliveryDate').value) }
    });
  }
}
