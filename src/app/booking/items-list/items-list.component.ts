import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BOOKING_ITEMS, BOOKING_ITEMS_TYPES_DISPLAY_NAMES } from 'src/app/constants';
import { ConfirmDialogComponent } from 'src/app/shared/elements/confirm-dialog/confirm-dialog.component';
import { AssignDialogComponent } from '../assign-dialog/assign-dialog.component';


  const COLUMNS_SCHEMA = [
    {
      key: 'isSelected',
      type: 'isSelected',
      label: 'Selected',
    },
    {
      key: 'type',
      type: 'select',
      label: 'Type',
    },
    {
      key: 'description',
      type: 'text',
      label: 'Description',
    },
    {
      key: 'value',
      type: 'number',
      label: 'Value (£)',
    },
    {
      key: 'quantity',
      type: 'number',
      label: 'Quantity',
    },
    {
      key: 'pricePerUnit',
      type: 'number',
      label: 'Price per unit (£)',
    },
    {
      key: 'amount',
      type: 'number',
      label: 'Amount (£)',
    },
    {
      key: 'isEdit',
      type: 'isEdit',
      label: 'Actions',
    },
  ];
@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css', '../../shared/shared-form.css']
})
export class ItemsListComponent implements OnInit, OnChanges {

  @Input() items;

  types = BOOKING_ITEMS_TYPES_DISPLAY_NAMES;
  selectedType;

  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  dataSource;
  columnsSchema: any = COLUMNS_SCHEMA;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.selectedType = this.types[0];
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if (changes.items.currentValue)
    {
      const newData = changes.items.currentValue.map((item, index) => Object.assign({}, item, { selected: false, index }))
      console.log(newData)
      this.dataSource = newData;
    }
  }

  addRow() {
    const pricePerUnit = this.getPricePerUnit('SMALL BOX');
    const amount = this.calculateAmount(pricePerUnit, 1)
    const newRow = {
      index: this.dataSource ? this.dataSource.length + 1 : 1,
      id: null,
      type: 'SMALL BOX',
      description: '',
      bookingReference: '',
      value: 0,
      quantity:  1,
      pricePerUnit,
      amount,
      isEdit: true,
      writable: true,
    };

    this.dataSource = this.dataSource ? this.dataSource = [newRow, ...this.dataSource] : [newRow]

  }

  removeRow(id) {
    this.dataSource = this.dataSource.filter((u) => u.id !== id);
  }

  removeSelectedRows() {
    this.dialog.open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.dataSource = this.dataSource.filter((u: any) => !u.isSelected);
        }
      });
  }

  selectType(event: Event, id) {
    this.dataSource.forEach((element, index) => {
      if (element.id === id)
      {
        const item = this.dataSource[index];
        item.pricePerUnit = this.getPricePerUnit(item.type);
        item.amount = this.calculateAmount(item.pricePerUnit, item.quantity);
      }
    });
  }

  changeInput(id, key) {
    this.dataSource.forEach((element, index) => {
      if (element.id === id)
      {
        const item = this.dataSource[index];
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
    if (this.dataSource)
    {
      this.dataSource.forEach((element) => {
        totalAmount = totalAmount + parseInt(element.amount, 10)
        totalItems = totalItems + parseInt(element.quantity, 10)
      });
    }

    return { totalAmount, totalItems };
  }

  getItemsDataDetails() {
    return {
      items:  this.dataSource ? this.dataSource.map(item => {
        delete item.__typename;
        delete item.selected;
        delete item.isEdit;
        delete item.writable;
        delete item.index;
        delete item.isSelected;
        item.value = parseInt(item.value, 10)
        item.quantity = parseInt(item.quantity, 10)
        item.pricePerUnit = parseInt(item.pricePerUnit, 10)
        item.amount = parseInt(item.pricePerUnit, 10)
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
    const dialogRef = this.dialog.open(AssignDialogComponent, {
      // height: '80%',
      // width: '65%',
      data: { item }
    });
  }
}
