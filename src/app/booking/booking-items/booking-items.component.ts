import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BOOKING_ITEMS, BOOKING_ITEMS_TYPES_DISPLAY_NAMES, FULL_PAYMENT_STATUS_ALIAS,
  NO_PAYMENT_PAYMENT_STATUS_ALIAS,
  PARTIAL_PAYMENT_STATUS_ALIAS, PAYMENT_STATUSES, PAYMENT_TYPES
} from 'src/app/constants';
import { ItemsListComponent } from '../items-list/items-list.component';
import { ItemService } from '../../items/item.service';
import { MatDialog } from '@angular/material/dialog';
import { AssignDialogComponent } from '../assign-dialog/assign-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { ItemDuplicateDialogComponent } from '../item-duplicate-dialog/item-duplicate-dialog.component';

export interface IItem {
  id: number
  quantity: number;
  type: string;
  description: string;
  value: string;
  pricePerUnit: string;
  amount: number;
}

const COLUMNS_SCHEMA = [
  { key: 'isSelected', type: 'isSelected', label: 'SELECTED'},
  { key: 'type', type: 'select', label: 'TYPE'},
  { key: 'description', type: 'text',label: 'DESCRIPTION'},
  { key: 'value', type: 'number', label: 'VALUE (£)',},
  { key: 'quantity', type: 'number', label: 'QUANTITY'},
  { key: 'pricePerUnit', type: 'number', label: 'PRICE PER UNIT (£)'},
  { key: 'amount', type: 'number', label: 'AMOUNT (£)'},
  { key: 'isEdit', type: 'isEdit', label: 'ACTIONS'},
];

@Component({
  selector: 'app-booking-items',
  templateUrl: './booking-items.component.html',
  styleUrls: ['./booking-items.component.css', '../../shared/shared-new-form.css']
})
export class BookingItemsComponent implements OnInit {
  @Input() paymentData;
  @ViewChild(ItemsListComponent) itemsListComponent: ItemsListComponent;
  itemsObjs;
  selectedType;
  dataSource;
  isAllSelected;
  showItems = false;
  bookingItemForm: FormGroup;
  paymentForm: FormGroup;
  showDescription = false;
  types = BOOKING_ITEMS_TYPES_DISPLAY_NAMES;
  typesObject = BOOKING_ITEMS
  paymentTypes = PAYMENT_TYPES
  paymentStatuses = PAYMENT_STATUSES;
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any = COLUMNS_SCHEMA;

  constructor(private formBuilder: FormBuilder, private itemService:ItemService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.selectedType = this.types[0];
    this.paymentForm = this.formBuilder.group({
      numberOfItems: [this.paymentData.numberOfItems ? this.paymentData.numberOfItems : 0 , [Validators.required]],
      paymentType: [this.paymentData.paymentType ? this.paymentData.paymentType : this.paymentTypes[0] , [Validators.required]],
      paymentStatus: [this.paymentData.paymentStatus ? this.paymentData.paymentStatus : this.paymentStatuses[0], Validators.required],
      paymentNotes: [this.paymentData.paymentNotes ? this.paymentData.paymentNotes : '', []],
      totalAmount: [this.paymentData.totalAmount ? this.paymentData.totalAmount : 0,  []],
      amountPaid: [this.paymentData.amountPaid ? this.paymentData.amountPaid : 0,  []],
      amountOutstanding: [this.paymentData.amountOutstanding ? this.paymentData.amountOutstanding: 0 , []]
    })

    this.getFormControl('totalAmount').disable();
    this.getFormControl('amountPaid').disable();
    this.getFormControl('amountOutstanding').disable();
    this.getBookingItems()
  }

  getFormControl(fControlName: string) {
    return this.paymentForm.get(fControlName)
  }

  getBookingItems() {
    if (this.paymentData.reference)
    {
      this.itemService.getItemsByBookingReference(this.paymentData.reference).subscribe(
        ({ data }) => {
          const items = data.itemsByBookingReference;
          if (items.length > 0)
          {
            const newData = items.map((item, index) => Object.assign({}, item, { selected: false, index }));
            console.log(newData)
            this.dataSource =  new MatTableDataSource(newData);
            // this.updateTotalAmount()
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  /***** Items service ****/

  addRow(element) {
    const pricePerUnit = this.getPricePerUnit('SMALL BOX');
    const amount = this.calculateAmount(pricePerUnit, 1)
    const newRow = {
      index : this.dataSource ? this.dataSource.data.length + 1 : 1,
      id: null,
      type: element ? element.type : 'SMALL BOX',
      description: element ? element.description : '',
      bookingReference: element ? element.bookingReference : '' ,
      value: element ? element.value : 0,
      quantity: element ? element.quantity :  1,
      pricePerUnit: element ? element.pricePerUnit : pricePerUnit,
      amount: element ? element.amount : amount,
      isEdit: false,
      writable: true,
    };

    const newData = this.dataSource ? this.dataSource = new MatTableDataSource([newRow, ...this.dataSource.data]) :
      new MatTableDataSource([newRow]);

    this.dataSource = newData;
    this.updateItemsInfo();
  }

  removeRow(id) {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true')
      {
        const newData = this.dataSource.data.filter((u) => u.index !== id);
        this.dataSource = new MatTableDataSource(newData);
        this.updateItemsInfo()
      }
    })
  }

  duplicateRow(element) {
   this.addRow(element)
  }

  addMultipleRow() {
    const items = this.dataSource.data.filter((u: any) => u.isSelected);

    this.dialog.open(ItemDuplicateDialogComponent, {
      data: { }
    }).afterClosed().subscribe(result => {
      items.forEach(item => {
        for (let i = 0; i < result.data; i++)
        {
          this.addRow(item)
        }
      });
    });
  }

  removeSelectedRows() {
    this.dialog.open(DialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.dataSource = new MatTableDataSource(this.dataSource.data.filter((u: any) => !u.selected));
          this.updateItemsInfo()
        }
      });
  }

  selectType(event: Event, id) {
    this.dataSource.data.forEach((element, index) => {
      if (element.id === id)
      {
        const item = this.dataSource.data[index];
        item.pricePerUnit = this.getPricePerUnit(item.type);
        item.amount = this.calculateAmount(item.pricePerUnit, item.quantity);
      }
    });
  }

  changeInput(id, key) {
    this.dataSource.data.forEach((element, index) => {
      if (element.id === id)
      {
        const item = this.dataSource.data[index];
        item.amount = this.calculateAmount(item.pricePerUnit, item.quantity);
      }
    });

  }

  getPricePerUnit(selection: string) {
    let price = null;
    BOOKING_ITEMS.forEach((element) => {
      if (element.DISPLAY_NAME === selection)
      {
        price = parseInt(element.PRICE, 10);
      }
    });

    return price;
  }

  calculateAmount(pricePerUnit, quantity) {
    return pricePerUnit * quantity;
  }

  calculateTotals() {
    let totalAmount = 0;
    let totalItems = 0;
    let totalValue = 0;
    if (this.dataSource && this.dataSource.data)
    {
      this.dataSource.data.forEach((element) => {
        totalAmount = totalAmount + parseInt(element.amount, 10);
        totalItems = totalItems + parseInt(element.quantity, 10);
        totalValue = totalValue + parseInt(element.value, 10)
      });
    }

    return { totalAmount, totalItems, totalValue };
  }

  getItemsDataDetails() {
    return {
      items: this.dataSource && this.dataSource.data ? this.dataSource.data.map(item => {
        delete item.__typename;
        delete item.selected;
        delete item.isEdit;
        delete item.writable;
        delete item.index;
        delete item.isSelected;
        item.value = parseInt(item.value, 10)
        item.quantity = parseInt(item.quantity, 10)
        item.pricePerUnit = parseInt(item.pricePerUnit, 10)
        item.amount = parseInt(item.amount, 10)
        return item;
      }) : [],
      totals: this.calculateTotals()
    }
  }

  numberOnly(event, key): boolean {
    if (key === 'description')
    {
      return true
    }
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  assignItem(item) {
    if (item.id)
    {
      const dialogRef = this.dialog.open(AssignDialogComponent, {data: { item }});
      dialogRef.afterClosed().subscribe()
    }
  }

  chooseColor(row) {
    if (row.value === 0 || row.value === '0')
    {
      return '#FFEBCA';
    }
  }

  showWarning() {
    if (this.dataSource && this.dataSource.data)
    {
      const errorItemsLength = this.dataSource.data.filter(item => item.value === 0 || item.value === '0').length;
      return errorItemsLength > 0;
    } else
    {
      return false;
    }
  }

  isMultipleEnabled() {
    this.isAllSelected = this.allEnabled();
   return this.dataSource && this.dataSource.data && this.dataSource.data.filter((u: any) => u.selected).length > 0;
  }

  isSelectLabel(label) {
    return label === 'SELECTED';
  }

  selectAll() {
    if (this.dataSource && this.dataSource.data)
    {
      this.isAllSelected = !this.isAllSelected
      this.dataSource = new MatTableDataSource(this.dataSource.data.map((obj) => ({ ...obj, selected: this.isAllSelected })));
    }
  }

  allEnabled() {
    if (this.dataSource && this.dataSource.data)
    {
      return this.dataSource.data.every(obj => obj.selected === true)
    } else
    {
      return false;
    }
  }


  /***** End Items service ****/


  populateFields() {
    if (this.paymentData.reference)
    {
      this.itemService.getItemsByBookingReference(this.paymentData.reference).subscribe(
        ({ data }) => {
          const items = data.itemsByBookingReference;
          if (items.length > 0)
          {
            this.itemsObjs = items;
            this.updateTotalAmount()
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }


  onSelectionChange(event: any, fControlName: string) {
    this.paymentForm.get(fControlName).setValue(event.value);
    if (fControlName === 'paymentStatus')
    {
      this.setPaymentProperties(event.value)
    }
  }

  onConfirmButton(element) {
    element.isEdit = !element.isEdit;
    const totals = this.calculateTotals();
    this.getFormControl('totalAmount').setValue(totals.totalAmount);
    this.getFormControl('numberOfItems').setValue(totals.totalItems);
    this.updateTotalAmount()
  }

  setPaymentProperties(paymentStatus: string) {
    const totalAmountControl =  this.paymentForm.get('totalAmount');
    const amountPaidControl =  this.paymentForm.get('amountPaid');
    const outstandingPaidControl =  this.paymentForm.get('amountOutstanding');

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

  isDisabled() {
    return this.showWarning() ? true : !this.showItems ? false : !this.bookingItemForm.valid;
  }

  isAmountPaidEnabled() {
    if (this.paymentForm.get('paymentStatus').value === PARTIAL_PAYMENT_STATUS_ALIAS)
    {
      this.paymentForm.get('amountPaid').enable();
    } else
    {
      this.paymentForm.get('amountPaid').disable();

    }
  }

  updateItemsInfo() {
    const totals = this.calculateTotals();
    this.getFormControl('totalAmount').setValue(totals.totalAmount);
    this.getFormControl('numberOfItems').setValue(totals.totalItems);
    this.updateTotalAmount()
  }

  updateTotalAmount() {
    if (this.paymentForm.get('paymentStatus').value === FULL_PAYMENT_STATUS_ALIAS)
    {
      this.paymentForm.get('amountPaid').setValue(this.getFormControl('totalAmount').value);
    }
    this.updateOutstandingAmount();

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

  getItemsDetails() {
    const itemsDetails = this.getItemsDataDetails();
    return {
      items: itemsDetails.items, paymentInfo: this.getPaymentInfoDetails(),
      totalNumberOfItems: itemsDetails.totals.totalItems,
      totalAmount: itemsDetails.totals.totalAmount,
    }
  }

  getPaymentInfoDetails() {
    const bookingPaymentDetails: any = {};
    Object.keys(this.paymentForm.controls).forEach(key => {
      const formControl = this.paymentForm.controls[key];
        bookingPaymentDetails[key] = formControl.value;
    });
    return bookingPaymentDetails;
  }

}
