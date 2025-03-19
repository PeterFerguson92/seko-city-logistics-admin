import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    BOOKING_ITEMS,
    BOOKING_ITEMS_TYPES_DISPLAY_NAMES,
    DISCOUNT_REASONS,
    DISCOUNT_TYPES,
    FULL_PAYMENT_STATUS_ALIAS,
    NO_PAYMENT_PAYMENT_STATUS_ALIAS,
    PARTIAL_PAYMENT_STATUS_ALIAS,
    PAYMENT_STATUSES,
    PAYMENT_TYPES,
} from 'src/app/constants';
import { ItemsListComponent } from '../items-list/items-list.component';
import { ItemService } from '../../items/item.service';
import { MatDialog } from '@angular/material/dialog';
import { AssignDialogComponent } from '../assign-dialog/assign-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { ItemDuplicateDialogComponent } from '../item-duplicate-dialog/item-duplicate-dialog.component';
import { UpdateItemsDialogComponent } from 'src/app/items/update-items-dialog/update-items-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/elements/confirm-dialog/confirm-dialog.component';

export interface IItem {
    id: number;
    quantity: number;
    type: string;
    description: string;
    value: string;
    pricePerUnit: string;
    amount: number;
}

const COLUMNS_SCHEMA = [
    { key: 'isSelected', type: 'isSelected', label: 'SELECTED', visible: true },
    { key: 'type', type: 'select', label: 'TYPE', visible: true },
    { key: 'description', type: 'text', label: 'DESCRIPTION', visible: true },
    { key: 'value', type: 'number', label: 'VALUE (£)', visible: true },
    { key: 'quantity', type: 'number', label: 'QUANTITY', visible: false },
    { key: 'pricePerUnit', type: 'number', label: 'PRICE PER UNIT (£)', visible: true },
    { key: 'amount', type: 'number', label: 'AMOUNT (£)', visible: true },
    { key: 'status', type: 'text', label: 'STATUS', visible: true },
    { key: 'isEdit', type: 'isEdit', label: 'ACTIONS', visible: true },
];

@Component({
    selector: 'app-booking-items',
    templateUrl: './booking-items.component.html',
    styleUrls: ['./booking-items.component.css', '../../shared/shared-new-form.css'],
})
export class BookingItemsComponent implements OnInit {
    @Input() paymentData;
    @ViewChild(ItemsListComponent) itemsListComponent: ItemsListComponent;
    itemsObjs;
    selectedType;
    dataSource;
    isAllSelected;
    showItems = false;
    showExtendedItems = true;
    extendedItemsButtonLabel = 'VIEW EXTENDED ITEMS';
    displayItemList = [];
    extendedDisplayItemList = [];
    errorMsg: string;
    bookingItemForm: FormGroup;
    paymentForm: FormGroup;
    showDescription = false;
    applyDiscountEnabled = true;
    types = BOOKING_ITEMS_TYPES_DISPLAY_NAMES;
    typesObject = BOOKING_ITEMS;
    paymentTypes = PAYMENT_TYPES;
    paymentStatuses = PAYMENT_STATUSES;
    discountReasons = DISCOUNT_REASONS;
    discountTypes = DISCOUNT_TYPES;
    displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
    columnsSchema: any = COLUMNS_SCHEMA;

    constructor(private formBuilder: FormBuilder, private itemService: ItemService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.selectedType = this.types[0];
        this.paymentForm = this.formBuilder.group({
            numberOfItems: [
                this.paymentData.numberOfItems ? this.paymentData.numberOfItems : 0,
                [Validators.required],
            ],
            paymentType: [
                this.paymentData.paymentType ? this.paymentData.paymentType : this.paymentTypes[0],
                [Validators.required],
            ],
            paymentStatus: [
                this.paymentData.paymentStatus ? this.paymentData.paymentStatus : this.paymentStatuses[0],
                Validators.required,
            ],
            paymentNotes: [this.paymentData.paymentNotes ? this.paymentData.paymentNotes : '', []],
            totalAmount: [this.paymentData.totalAmount ? this.paymentData.totalAmount : 0, []],
            fullAmount: [this.paymentData.fullAmount ? this.paymentData.fullAmount : 0, []],
            amountPaid: [this.paymentData.amountPaid ? this.paymentData.amountPaid : 0, []],
            discountType: [
                this.paymentData.discountType ? this.paymentData.discountType : this.discountTypes[0],
                [],
            ],
            amountOutstanding: [this.paymentData.amountOutstanding ? this.paymentData.amountOutstanding : 0, []],
            discountAmount: [this.paymentData.discountAmount ? this.paymentData.discountAmount : 0, []],
            discountReason: [
                this.paymentData.discountReason ? this.paymentData.discountReason : this.discountReasons[0],
                [],
            ],
            isDiscountApplied: [
                this.paymentData.isDiscountApplied ? this.paymentData.isDiscountApplied : false,
                [],
            ],
        });
        if (this.getFormControl('paymentStatus').value === PARTIAL_PAYMENT_STATUS_ALIAS) {
            this.getFormControl('amountPaid').enable();
        } else {
            this.getFormControl('amountPaid').disable();
        }
        this.getFormControl('numberOfItems').disable();
        this.getFormControl('totalAmount').disable();
        this.getFormControl('amountOutstanding').disable();
        this.getFormControl('fullAmount').disable();

        this.getBookingItems();
    }

    getDisplayedColumns(): string[] {
        return this.columnsSchema.filter((cd) => cd.visible).map((cd) => cd.key);
    }

    getFormControl(fControlName: string) {
        return this.paymentForm.get(fControlName);
    }

    getBookingItems() {
        if (this.paymentData.reference) {
            this.itemService.getItemsByBookingReference(this.paymentData.reference).subscribe(
                ({ data }) => {
                    const items = data.itemsByBookingReference;
                    if (items.length > 0) {
                        const newData = items.map((item, index) =>
                            Object.assign({}, item, { selected: false, index })
                        );
                        this.extendedDisplayItemList = newData;
                        this.dataSource = new MatTableDataSource(this.extendedDisplayItemList);
                        this.processDisplayItem(this.extendedDisplayItemList);
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }

  processDisplayItem(items) {
    this.displayItemList = [];
        let index;
        items.forEach((item: any) => {

            if (item.type !== 'OTHER') {
                index = this.displayItemList.findIndex((obj: any) => {
                    return obj.type === item.type && obj.value.toString() === item.value.toString();
                });
            } else {
                index = this.displayItemList.findIndex((obj: any) => {
                    return (
                        obj.type === item.type &&
                        obj.value.toString() === item.value.toString() &&
                        obj.description === item.description
                    );
                });
            }
            if (index > -1) {
                const newqty = this.displayItemList[index].quantity + item.quantity;
                const newObj = { ...item, quantity: newqty, amount: newqty * item.pricePerUnit };
                this.displayItemList[index] = newObj;
            } else {
                const newObj = { ...item, quantity: 1, amount: item.pricePerUnit };
                this.displayItemList.push(newObj);
            }
        });

        console.log(this.displayItemList);
    }

    /***** Items service ****/

    addRow(element) {
        const pricePerUnit = this.getPricePerUnit('SMALL BOX');
        const amount = this.calculateAmount(pricePerUnit, 1);
        const newRow = {
            index: this.dataSource ? this.dataSource.data.length + 1 : 1,
            id: null,
            type: element ? element.type : 'SMALL BOX',
            description: element ? element.description : '',
            bookingReference: element ? element.bookingReference : '',
            value: element ? element.value : 0,
            quantity: element ? element.quantity : 1,
            pricePerUnit: element ? element.pricePerUnit : pricePerUnit,
            amount: element ? element.amount : amount,
            isEdit: false,
            writable: true,
        };

        let newData;
        if (this.dataSource && this.dataSource.data) {
            this.dataSource.data.push(newRow);
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            newData = this.dataSource;
        } else {
            newData = new MatTableDataSource([newRow]);
        }

        this.dataSource = newData;
        this.updateItemsInfo();
    }

    removeRow(id) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'true') {
                const newData = this.dataSource.data.filter((u) => u.index !== id);
                this.dataSource = new MatTableDataSource(newData);
                if (this.dataSource.data.length === 0) {
                    this.getFormControl('discountAmount').setValue(0);
                }
                this.updateItemsInfo();
            }
        });
    }

    duplicateRow(element) {
        this.addRow(element);
    }

    addMultipleRow() {
        const items = this.dataSource.data.filter((u: any) => u.selected);
        this.dialog
            .open(ItemDuplicateDialogComponent, {
                data: {},
            })
            .afterClosed()
            .subscribe((result) => {
                items.forEach((item) => {
                    for (let i = 0; i < result.data; i++) {
                        this.addRow(item);
                    }
                });
            });
    }

    removeSelectedRows() {
        this.dialog
            .open(DialogComponent)
            .afterClosed()
            .subscribe((confirm) => {
                if (confirm) {
                    this.dataSource = new MatTableDataSource(this.dataSource.data.filter((u: any) => !u.selected));
                    this.updateItemsInfo();
                }
            });
    }

    updateStatus() {
        const items = this.dataSource.data.filter((u: any) => u.selected);
        const itemsIds = items.map((a) => a.id);
        const dialogRef = this.dialog.open(UpdateItemsDialogComponent, {
            data: { itemsIds, allItems: false },
        });

        dialogRef.afterClosed().subscribe((result) => {
            itemsIds.forEach((id, i) => {
                const foundIndex = this.dataSource.data.findIndex((x) => x.id === id);
                this.dataSource.data[foundIndex].status = result.updatedStatus;
            });
        });
    }

    selectType(event: Event, id) {
        this.dataSource.data.forEach((element, index) => {
            if (element.id === id) {
                const item = this.dataSource.data[index];
                item.pricePerUnit = this.getPricePerUnit(item.type);
                item.amount = this.calculateAmount(item.pricePerUnit, item.quantity);
            }
        });
    }

    changeInput(id, key) {
        this.dataSource.data.forEach((element, index) => {
            if (element.id === id) {
                const item = this.dataSource.data[index];
                item.amount = this.calculateAmount(item.pricePerUnit, item.quantity);
            }
        });
    }

    getPricePerUnit(selection: string) {
        let price = null;
        BOOKING_ITEMS.forEach((element) => {
            if (element.DISPLAY_NAME === selection) {
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
        if (this.dataSource && this.dataSource.data) {
            this.dataSource.data.forEach((element) => {
                totalAmount = totalAmount + parseInt(element.amount, 10);
                totalItems = totalItems + parseInt(element.quantity, 10);
                totalValue = totalValue + parseInt(element.value, 10);
            });
        }

        return { totalAmount, totalItems, totalValue };
    }

    getItemsDataDetails() {
        return {
            items:
                this.dataSource && this.dataSource.data
                    ? this.dataSource.data.map((item) => {
                          delete item.__typename;
                          delete item.selected;
                          delete item.isEdit;
                          delete item.writable;
                          delete item.index;
                          delete item.isSelected;
                          item.value = parseInt(item.value, 10);
                          item.quantity = parseInt(item.quantity, 10);
                          item.pricePerUnit = parseInt(item.pricePerUnit, 10);
                          item.amount = parseInt(item.amount, 10);
                          return item;
                      })
                    : [],
            totals: this.calculateTotals(),
        };
    }

    isCellDisabled(key, element) {
        return key === 'status' || (key === 'pricePerUnit' && element.type !== 'OTHER') || key === 'amount';
    }

    numberOnly(event, key): boolean {
        if (key === 'description' || key === 'status') {
            return true;
        }
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    assignItem(item) {
        if (item.id) {
            const dialogRef = this.dialog.open(AssignDialogComponent, {
                height: '38%',
                width: '30%',
                data: { item },
            });
            dialogRef.afterClosed().subscribe();
        }
    }

    chooseColor(row) {
        if (row.value === 0 || row.value === '0' || row.pricePerUnit === null) {
            return '#FFEBCA';
        }
    }

    showWarning() {
        if (this.dataSource && this.dataSource.data) {
            const errorItemsLength = this.dataSource.data.filter(
                (item) => item.value === 0 || item.value === '0' || item.pricePerUnit === null
            ).length;
            return errorItemsLength > 0;
        } else {
            return false;
        }
    }

    isMultipleEnabled() {
        return (
            this.dataSource &&
            this.dataSource.data &&
            this.dataSource.data.filter((u: any) => u.selected).length > 0
        );
    }

    isAllChecked() {
        const result =
            this.dataSource &&
            this.dataSource.data &&
            this.dataSource.data.filter((u: any) => u.selected).length === this.dataSource.data.length;
        this.isAllSelected = result;
        return result;
    }

    isSelectLabel(label) {
        return label === 'SELECTED';
    }

    isEdit(element) {
        element.isEdit = !element.isEdit;
        this.hideNotEditableColumns(false);
    }

    onConfirmButton(element) {
        element.isEdit = !element.isEdit;
        this.hideNotEditableColumns(true);
        const totals = this.calculateTotals();
        this.getFormControl('fullAmount').setValue(totals.totalAmount);
        this.getFormControl('totalAmount').setValue(totals.totalAmount);
        this.getFormControl('numberOfItems').setValue(totals.totalItems);
        this.updateTotalAmount();
        console.log(this.dataSource.data);
        this.processDisplayItem(this.dataSource.data);
    }

    hideNotEditableColumns(isHidden) {
        this.columnsSchema[0].visible = isHidden;
        this.columnsSchema[6].visible = isHidden;
        this.columnsSchema[7].visible = isHidden;
    }

    selectRow(element) {
        element.selected = !element.selected;
    }

    selectAll() {
        if (this.dataSource && this.dataSource.data) {
            this.isAllSelected = !this.isAllSelected;
            this.dataSource = new MatTableDataSource(
                this.dataSource.data.map((obj) => ({ ...obj, selected: this.isAllSelected }))
            );
        }
    }

    allEnabled() {
        if (this.dataSource && this.dataSource.data) {
            return this.dataSource.data.every((obj) => obj.selected === true);
        } else {
            return false;
        }
    }

    /***** End Items service ****/

    populateFields() {
        if (this.paymentData.reference) {
            this.itemService.getItemsByBookingReference(this.paymentData.reference).subscribe(
                ({ data }) => {
                    const items = data.itemsByBookingReference;
                    if (items.length > 0) {
                        this.itemsObjs = items;
                        this.updateTotalAmount();
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }

    onSelectionChange(event: any, fControlName: string) {
        this.paymentForm.get(fControlName).setValue(event.value);
        if (fControlName === 'paymentStatus') {
            this.setPaymentProperties(event.value);
        }
    }

    isApplyDiscountDisabled() {
        if (this.getFormControl('isDiscountApplied').value === true) {
            return true;
        } else {
            const threshold =
                this.getFormControl('discountType').value === 'PERCENTAGE'
                    ? 101
                    : this.getFormControl('totalAmount').value;
            return parseInt(this.getFormControl('discountAmount').value, 10) < threshold;
        }
    }

    getErrorMessage() {
        return this.isApplyDiscountDisabled() ? 'EIRRR' : null;
    }

    getApplyRemoveDiscountLabel() {
        return this.getFormControl('isDiscountApplied').value ? 'REMOVE DISCOUNT' : 'APPLY DISCOUNT';
    }

    getMax() {
        return this.getFormControl('totalAmount').value;
    }

    getMaxDiscount() {
        return 100;
    }

    isPercentageDiscount() {
        return this.getFormControl('discountType').value === 'PERCENTAGE';
    }

    onApplyRemoveDiscount() {
        this.processDiscount();
    }

    processDiscount() {
        const isDiscountAppliedControl = this.getFormControl('isDiscountApplied');

        const totalAmountControl = this.getFormControl('totalAmount');
        const discountAmountControl = this.getFormControl('discountAmount');

        isDiscountAppliedControl.setValue(!isDiscountAppliedControl.value);

        if (isDiscountAppliedControl.value) {
            this.applyDiscount(totalAmountControl, discountAmountControl);
        } else {
            this.removeDiscount(totalAmountControl, discountAmountControl);
        }
        if (this.paymentForm.get('paymentStatus').value === FULL_PAYMENT_STATUS_ALIAS) {
            this.paymentForm.get('amountPaid').setValue(this.getFormControl('totalAmount').value);
        }
        this.updateOutstandingAmount();
    }

    applyDiscount(totalAmountControl, discountAmountControl) {
        discountAmountControl.disable();
        if (this.getFormControl('discountType').value === 'PERCENTAGE') {
            totalAmountControl.setValue(
                parseInt(
                    this.calculatePercentage(totalAmountControl.value, discountAmountControl.value).toString(),
                    10
                )
            );
        } else {
            totalAmountControl.setValue(totalAmountControl.value - discountAmountControl.value);
        }
    }

    removeDiscount(totalAmountControl, discountAmountControl) {
        discountAmountControl.enable();

        if (this.getFormControl('discountType').value === 'PERCENTAGE') {
            totalAmountControl.setValue(parseInt(this.getFormControl('fullAmount').value, 10));
        } else {
            totalAmountControl.setValue(
                parseInt(totalAmountControl.value, 10) + parseInt(discountAmountControl.value, 10)
            );
        }
    }

    calculatePercentage(fullAmount, discount) {
        return fullAmount * ((100 - discount) / 100);
    }

    setPaymentProperties(paymentStatus: string) {
        const totalAmountControl = this.paymentForm.get('totalAmount');
        const amountPaidControl = this.paymentForm.get('amountPaid');
        const outstandingPaidControl = this.paymentForm.get('amountOutstanding');

        switch (paymentStatus) {
            case FULL_PAYMENT_STATUS_ALIAS:
                amountPaidControl.setValue(totalAmountControl.value);
                outstandingPaidControl.setValue(0);
                amountPaidControl.disable();
                break;
            case PARTIAL_PAYMENT_STATUS_ALIAS:
                outstandingPaidControl.setValue(outstandingPaidControl.value);
                amountPaidControl.setValue(1);
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
        if (this.paymentForm.get('paymentStatus').value === PARTIAL_PAYMENT_STATUS_ALIAS) {
            this.paymentForm.get('amountPaid').enable();
        } else {
            this.paymentForm.get('amountPaid').disable();
        }
    }

    updateItemsInfo() {
        const totals = this.calculateTotals();
        this.getFormControl('totalAmount').setValue(totals.totalAmount);
        this.getFormControl('fullAmount').setValue(totals.totalAmount);
        this.getFormControl('numberOfItems').setValue(totals.totalItems);
        this.updateTotalAmount();
        if (this.getFormControl('isDiscountApplied').value) {
            this.processDiscount();
        }
    }

    updateTotalAmount() {
        if (this.paymentForm.get('paymentStatus').value === FULL_PAYMENT_STATUS_ALIAS) {
            this.paymentForm.get('amountPaid').setValue(this.getFormControl('totalAmount').value);
            this.paymentForm.get('fullAmount').setValue(this.getFormControl('totalAmount').value);
        }
        this.updateOutstandingAmount();
    }

    updateOutstandingAmount() {
        const totalAmountControl = this.getFormControl('totalAmount');
        const amountPaidControl = this.getFormControl('amountPaid');
        const outstandingPaidControl = this.getFormControl('amountOutstanding');

        if (parseInt(amountPaidControl.value, 10) <= 0) {
            amountPaidControl.setValue(0);
            outstandingPaidControl.setValue(totalAmountControl.value);
            this.getFormControl('paymentStatus').setValue(NO_PAYMENT_PAYMENT_STATUS_ALIAS);
        } else {
            if (amountPaidControl.value >= totalAmountControl.value) {
                amountPaidControl.setValue(totalAmountControl.value);
                this.getFormControl('paymentStatus').setValue(FULL_PAYMENT_STATUS_ALIAS);
                outstandingPaidControl.setValue(0);
            } else {
                this.getFormControl('paymentStatus').setValue(PARTIAL_PAYMENT_STATUS_ALIAS);
                outstandingPaidControl.setValue(totalAmountControl.value - amountPaidControl.value);
            }
        }
    }

    getItemsDetails() {
        const itemsDetails = this.getItemsDataDetails();
        return {
            items: itemsDetails.items,
            paymentInfo: this.getPaymentInfoDetails(),
            totalNumberOfItems: itemsDetails.totals.totalItems,
            totalAmount: itemsDetails.totals.totalAmount,
        };
    }

    getPaymentInfoDetails() {
        const bookingPaymentDetails: any = {};
        Object.keys(this.paymentForm.controls).forEach((key) => {
            const formControl = this.paymentForm.controls[key];
            bookingPaymentDetails[key] = formControl.value;
        });
        return bookingPaymentDetails;
    }

    displayExtendedItems() {
        this.showExtendedItems = !this.showExtendedItems;
        this.extendedItemsButtonLabel = this.showExtendedItems ? 'VIEW EXTENDED ITEMS' : 'VIEW COMPRESSED ITEMS';
    }
}
