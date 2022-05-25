import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IBooking } from 'src/app/booking/model';
import { ItemService } from 'src/app/booking/service/items/item.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-assign-items',
  templateUrl: './assign-items.component.html',
  styleUrls: ['./assign-items.component.css']
})
export class AssignItemsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() bookings: [IBooking] = null;
  displayedColumns: string[] = ['ASSIGNED', 'BOOKING REFERENCE', 'TYPE', 'DESCRIPTION', 'VALUE',
    'QUANTITY', 'PRICE PER UNIT', 'AMOUNT', 'ACTION'];
  selection = new SelectionModel<IBooking>(true, []);
  selectedShipmentForm: FormGroup;
  shipments;
  shipmentsObjs;
  dataSource = null;
  height =  '80%';
  width = '65%';

  constructor(private router: Router, private activatedroute: ActivatedRoute,
    private itemService: ItemService,
    private formBuilder: FormBuilder, private commonService: CommonService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data.info[0].data.filterItems);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.shipmentsObjs = data.info[1].data.shipments
      this.shipments = this.getShipmentsDetailsList(this.shipmentsObjs)
      this.selectedShipmentForm = this.formBuilder.group({ selectedShipment: [this.shipments[0]]});
    })

    this.dataSource.data.forEach(row => {
      // if (row.shipmentReference === this.activatedroute.snapshot.params.reference) this.selection.select(row);
    });
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }

  isSelected(element) {
    this.selection.isSelected(element);
    return element.shipmentReference === this.activatedroute.snapshot.params.reference;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // if there is a selection then clear that selection
    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  isSomeSelected() {
    return this.selection.selected.length > 0;
  }

  onAssign() {
    const itemsIdsToAssign = [];
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row))
      {
        itemsIdsToAssign.push(row.id)
      }
    });
    console.log(itemsIdsToAssign)
    this.assignItemsToShipment(itemsIdsToAssign)
  }

  assignItemsToShipment(itemsIdsToAssign) {
    const fieldToUpdate = { name: 'shipmentReference', value: this.getShipmentReferenceFromSelection() };
    this.itemService.updateItemsById(itemsIdsToAssign, fieldToUpdate).subscribe(
      ({ data }) => {
        location.reload();  // TODO handle properly
      },
      error => {
        console.log(error);
      }
    )
  }

  getShipmentReferenceFromSelection() {
    const shipmentSelection = this.getFormControl('selectedShipment').value;
    const containerNumber = shipmentSelection.split(' - ')[0];
    return this.shipmentsObjs.find(shipment => shipment.containerNumber === containerNumber).reference;
  }

  getShipmentsDetailsList(shipments) {
    const shipmentsDetails: string[] = [];
    shipments.forEach((shipment) => {
      shipmentsDetails.push(`${shipment.containerNumber}`)
    })
    return shipmentsDetails
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    const data = fControlName === 'useRange' ? event.checked : event.value;
    fControl.setValue(data);
    fControl.markAsDirty();
  }

   getFormControl(fControlName: string) {
    return this.selectedShipmentForm.get(fControlName)
   }

   onViewBooking(reference) {
    this.router.navigate(['/booking-summary', reference]);
  }

}
